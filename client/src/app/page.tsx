"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import Header from "@/components/Header";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {isChecking ? (
          <div className="text-center">
            <div className="relative mb-8">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-ping"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-300 rounded-full animate-pulse"></div>
              </div>
              <div className="relative w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Hold on tight, we're taking you to your dashboard...
            </p>

            {/* Animated progress bar */}
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-[progressBar_2.5s_ease-in-out]"></div>
            </div>

            <div className="mt-6 flex justify-center space-x-2">
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "200ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "400ms" }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {showWelcome ? (
              <div className="animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome to VideoHub
                </h1>
                <p className="text-gray-600">Please sign in to continue</p>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to get started?
                </h1>
                <p className="text-gray-600 max-w-md mx-auto">
                  Sign in to access your video library, upload new content, and
                  manage your account.
                </p>
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
        .animate-\[progressBar_2\.5s_ease-in-out\] {
          animation: progressBar 2.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
