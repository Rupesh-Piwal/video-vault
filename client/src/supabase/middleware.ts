import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
  !user &&
  request.nextUrl.pathname !== "/" && // 👈 allow landing page
  !request.nextUrl.pathname.startsWith("/sign-in") &&
  !request.nextUrl.pathname.startsWith("/sign-up") &&
  !request.nextUrl.pathname.startsWith("/auth") &&
  !request.nextUrl.pathname.startsWith("/error")
) {
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  return NextResponse.redirect(url);
}


  return supabaseResponse;
}
