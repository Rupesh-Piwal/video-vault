
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";
import config from "../../../../../config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${config.domainName}${next}`);
    }
  }

  return NextResponse.redirect(`${config.domainName}/auth/auth-code-error`);
}
