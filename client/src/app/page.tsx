"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import Header from "@/components/Header";
import SVGLogo from "@/components/svg-logo";
import { TextShimmer } from "../../components/motion-primitives/text-shimmer";

export const dynamic = "force-dynamic";

export default function Page() {
  const router = useRouter();
  const supabase = createClient();
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
        setShowWelcome(true);
      }
    }

    checkAuth();
  }, [supabase, router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0D0E" }}>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {isChecking ? (
          <div className="text-center">
            <div className="relative mb-8">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#2B2C2D" }}
              >
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            <TextShimmer className="font-mono text-xl" duration={1}>
              Checking Authentication
            </TextShimmer>
            <p className="text-gray-400 text-sm">Please wait...</p>
          </div>
        ) : (
          <div className="text-center max-w-md mx-auto">
            {showWelcome ? (
              <div className="animate-fade-in">
                <div className="mb-10">
                  <div
                    className="w-14 h-14 mx-auto mb-8 rounded-full flex items-center justify-center border"
                    style={{
                      backgroundColor: "#18191A",
                      borderColor: "#2B2C2D",
                    }}
                  >
                    <SVGLogo />
                  </div>
                  <h1 className="text-2xl font-light text-white mb-4 tracking-wide">
                    Access Your Content
                  </h1>
                  <p
                    className="text-sm leading-relaxed px-4"
                    style={{ color: "#8C8C8C" }}
                  >
                    Sign in to manage your video library and access all
                    features.
                  </p>
                </div>

                <div className="space-y-4 mt-12">
                  <button
                    className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 active:opacity-80 cursor-pointer"
                    style={{ backgroundColor: "#383838" }}
                    onClick={() => router.push("/sign-in")}
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 border hover:opacity-90 active:opacity-80 cursor-pointer"
                    style={{ borderColor: "#606060", color: "#8C8C8C" }}
                    onClick={() => router.push("/sign-up")}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
