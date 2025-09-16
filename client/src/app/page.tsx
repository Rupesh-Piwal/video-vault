"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import Header from "@/components/Header";
import SVGLogo from "@/components/svg-logo";
import { TextShimmer } from "../../components/motion-primitives/text-shimmer";

export default function Page() {
  const router = useRouter();
  const supabase = createClient();
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Show redirect message before actually redirecting
        setTimeout(() => {
          router.replace("/dashboard");
        }, 2500);
      } else {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [supabase, router]);

  // Hide welcome message after initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
              Redirecting to Dashboard
            </TextShimmer>
            <p className="text-gray-400 text-sm">Please wait a moment...</p>

            <div
              className="w-48 h-1 rounded-full overflow-hidden mx-auto mt-6"
              style={{ backgroundColor: "#18191A" }}
            >
              <div className="h-full bg-white rounded-full animate-[progressBar_2.5s_ease-in-out]"></div>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-md mx-auto">
            {showWelcome ? (
              <div className="animate-fade-in">
                <div
                  className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center border"
                  style={{ backgroundColor: "#18191A", borderColor: "#2B2C2D" }}
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-light text-white mb-3 tracking-wide">
                  Welcome Back
                </h1>
                <p
                  className="text-gray-400 text-base"
                  style={{ color: "#8C8C8C" }}
                >
                  Sign in to continue to your account
                </p>
              </div>
            ) : (
              <div className="animate-fade-in-up">
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
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes progressBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-\\[progressBar_2\\.5s_ease-in-out\\] {
          animation: progressBar 2.5s ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
