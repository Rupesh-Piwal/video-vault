"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/supabase/client";
import SVGLogo from "@/components/svg-logo";
import config from "../../../config";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-black relative overflow-hidden">
      {/* Animated Gradient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-neon-purple/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-electric-blue/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-deep-purple/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="relative rounded-3xl p-10 bg-glass-bg backdrop-blur-md border border-glass-border shadow-2xl">
          {/* Purple Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-purple/5 to-electric-blue/5 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple to-deep-purple blur-lg opacity-50" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-neon-purple to-deep-purple shadow-lg shadow-neon-purple/50">
                  <SVGLogo />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-text-gray-light bg-clip-text text-transparent">
                {mode === "signin" ? "Welcome back" : "Get started"}
              </h1>
              <p className="text-text-gray-muted text-base">
                {mode === "signin"
                  ? "Sign in to continue to VidVault"
                  : "Create your account and start uploading"}
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full group relative overflow-hidden rounded-xl px-6 py-4 font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white text-gray-900 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              <div className="flex items-center justify-center gap-3">
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
                <span className="text-base">
                  {loading ? "Connecting..." : "Continue with Google"}
                </span>
              </div>
              
              {loading && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-white/90 backdrop-blur-sm">
                  <div className="w-5 h-5 border-3 border-gray-300 border-t-neon-purple rounded-full animate-spin" />
                </div>
              )}
            </button>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-text-gray-muted">
                {mode === "signin" ? "New to VidVault? " : "Already have an account? "}
                <Link
                  href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                    redirect ? `?redirect=${redirect}` : ""
                  }${priceId ? `&priceId=${priceId}` : ""}`}
                  className="font-semibold text-neon-purple hover:text-electric-blue transition-colors duration-200"
                >
                  {mode === "signin" ? "Create account" : "Sign in"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-6 flex justify-center">
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-neon-purple to-electric-blue shadow-lg shadow-neon-purple/50" />
        </div>
      </div>
    </div>
  );
}
