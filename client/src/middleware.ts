import type { NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!^/$|sign-in|sign-up|auth|error|_next|api|public).*)"],
};
