import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/supabase/server";
import { createAdminClient } from "@/lib/supabaseAdmin";

function requireUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();
    const userId = requireUserId(req);
    const { id } = await params; 

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { visibility, emails = [], expiryPreset } = await req.json();

    if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
      return NextResponse.json(
        { error: "Invalid visibility" },
        { status: 400 }
      );
    }

    const expiryMap: Record<string, number | null> = {
      "1h": 3600,
      "12h": 43200,
      "1d": 86400,
      "30d": 2592000,
      forever: null,
    };

    if (!(expiryPreset in expiryMap)) {
      return NextResponse.json(
        { error: "Invalid expiry preset" },
        { status: 400 }
      );
    }

    const expiresAt = expiryMap[expiryPreset]
      ? new Date(Date.now() + expiryMap[expiryPreset]! * 1000).toISOString()
      : null;

    const token = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const { data: link, error } = await supabase
      .from("share_links")
      .insert({
        video_id: id, 
        user_id: userId,
        hashed_token: hashed,
        visibility,
        expiry: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    if (visibility === "PRIVATE" && emails.length > 0) {
      const {
        data: { users },
        error: authError,
      } = await supabaseAdmin.auth.admin.listUsers();

      if (authError) {
        console.error("Auth admin error:", authError);
      }

      const registeredEmails = new Set(
        users?.map((user) => user.email?.toLowerCase()).filter(Boolean) || []
      );

      for (const email of emails) {
        const trimmedEmail = email.trim().toLowerCase();

        await supabase.from("share_link_whitelist").insert({
          share_link_id: link.id,
          email: trimmedEmail,
        });

        if (registeredEmails.has(trimmedEmail)) {
          console.log(
            `📧 Sending notification to registered user: ${trimmedEmail}`
          );

          const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_URL;
          if (!baseUrl) {
            console.error("EXPRESS_URL environment variable is missing");
            continue;
          }

          try {
            await fetch(`${baseUrl}/jobs/send-email`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: trimmedEmail,
                videoId: id, 
                token,
                type: "SHARE_NOTIFICATION",
              }),
            });
            console.log(`✅ Notification sent to: ${trimmedEmail}`);
          } catch (emailError) {
            console.error(
              `❌ Failed to send email to ${trimmedEmail}:`,
              emailError
            );
          }
        } else {
          console.log(
            `⏭️ Skipping email for non-registered user: ${trimmedEmail}`
          );
        }
      }
    }

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`,
      message: "Share link created successfully",
    });
  } catch (err) {
    console.error("Share link creation error:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
