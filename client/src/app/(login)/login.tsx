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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#18191A" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: "#2B2C2D", opacity: 0.4 }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: "#2B2C2D", opacity: 0.4 }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        <div
          className="rounded-3xl p-8"
          style={{ backgroundColor: "#2B2C2D", borderColor: "#3A3B3C" }}
        >
          <div className="flex justify-center mb-8">
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: "#3A3B3C" }}
            >
              <SVGLogo />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1
              className="text-3xl font-light mb-2"
              style={{ color: "#E4E6EB" }}
            >
              {mode === "signin" ? "Welcome back" : "Get started"}
            </h1>
            <p className="font-light" style={{ color: "#B0B3B8" }}>
              {mode === "signin"
                ? "Sign in to your account"
                : "Create your new account"}
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full group relative overflow-hidden rounded-2xl px-6 py-4 font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: "#3A3B3C",
              borderColor: "#4E4F50",
              color: "#E4E6EB",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4A4B4C";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3A3B3C";
              e.currentTarget.style.boxShadow = "none";
            }}
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
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(58, 59, 60, 0.8)" }}
              >
                <div
                  className="w-5 h-5 border-2 rounded-full animate-spin"
                  style={{ borderColor: "#3A3B3C", borderTopColor: "#E4E6EB" }}
                ></div>
              </div>
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm font-light" style={{ color: "#B0B3B8" }}>
              {mode === "signin" ? "New here? " : "Already have an account? "}
              <Link
                href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                  redirect ? `?redirect=${redirect}` : ""
                }${priceId ? `&priceId=${priceId}` : ""}`}
                className="font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "#E4E6EB" }}
              >
                {mode === "signin" ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>

        <div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full"
          style={{ backgroundColor: "#3A3B3C" }}
        ></div>
      </div>
    </div>
  );
}
