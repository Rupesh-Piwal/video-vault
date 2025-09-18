import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { buildShareUrl, convertPresetToExpiry } from "@/lib/dayUtils";
import { resend } from "@/lib/resendClient";
import { createClient } from "@/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // 🔹 Parse body
    const body = await req.json();
    const {
      visibility,
      emails = [],
      expiryPreset,
    } = body as {
      visibility: "PUBLIC" | "PRIVATE";
      emails?: string[];
      expiryPreset: "1h" | "12h" | "1d" | "30d" | "forever";
    };

    if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
      return NextResponse.json(
        { error: "invalid visibility" },
        { status: 400 }
      );
    }

    const expiry = convertPresetToExpiry(expiryPreset);
    const token = uuidv4();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Insert into share_links
    const { data: share, error: insertError } = await supabase
      .from("share_links")
      .insert({
        video_id: params.id,
        user_id: user.id,
        token,
        visibility,
        expiry,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 🔹 If PRIVATE → insert whitelist + notify
    if (visibility === "PRIVATE" && emails.length > 0) {
      const rows = emails.map((e) => ({
        share_link_id: share.id,
        email: e.trim().toLowerCase(),
      }));
      await supabase.from("share_link_whitelist").insert(rows);

      const { data: registered } = await supabase.auth.admin.listUsers();
      const registeredEmails = registered?.users
        .map((u) => u.email)
        .filter((e): e is string => e !== null);

      const notifyList = rows.filter((r) => registeredEmails.includes(r.email));

      // Get video title
      const { data: video } = await supabase
        .from("videos")
        .select("original_filename")
        .eq("id", params.id)
        .single();

      const title = video?.original_filename ?? "a video";
      const url = buildShareUrl(token);
      console.log("URL---", url);

      // Fire emails
      for (const u of notifyList) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: u.email,
          subject: "A private video was shared with you",
          html: `<p>A video "<b>${title}</b>" was shared with you.</p><p><a href="${url}">Open link</a></p>`,
        });
      }
    }

    // 🔹 Response
    return NextResponse.json(
      {
        id: share.id,
        token,
        url: buildShareUrl(token),
        expiry,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
