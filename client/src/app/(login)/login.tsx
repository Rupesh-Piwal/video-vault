"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/supabase/client";
import config from "../../../client/config";
import SVGLogo from "@/components/svg-logo";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const discountCode = searchParams.get("discountCode");

  const handleGoogleSignIn = () => {
    const redirectTo = `${config.domainName}/api/auth/callback`;
    setLoading(true);
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ""
        )}&discountCode=${encodeURIComponent(
          discountCode || ""
        )}&redirect=${encodeURIComponent("/test")}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl shadow-gray-900/5 border border-white/20 p-8">
          <div className="flex justify-center mb-8">
            <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg">
              <SVGLogo />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">
              {mode === "signin" ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-gray-600 font-light">
              {mode === "signin"
                ? "Sign in to your account"
                : "Create your new account"}
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 px-6 py-4 text-gray-700 font-medium transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{loading ? "Connecting..." : `Continue with Google`}</span>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-light">
              {mode === "signin" ? "New here? " : "Already have an account? "}
              <Link
                href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                  redirect ? `?redirect=${redirect}` : ""
                }${priceId ? `&priceId=${priceId}` : ""}`}
                className="text-gray-800 font-medium hover:text-gray-600 transition-colors duration-200"
              >
                {mode === "signin" ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
