"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import SVGLogo from "./svg-logo";
import Image from "next/image";

interface User {
  id: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure this only runs on client
    if (typeof window === "undefined") return;

    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser({
            id: user.id,
            user_metadata: user.user_metadata,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getFirstName = (fullName: string) => {
    return (
      fullName?.split(" ")[0]?.charAt(0).toUpperCase() +
        fullName?.split(" ")[0]?.slice(1) || "User"
    );
  };
  if (loading) {
    return (
      <header
        className="w-full border-b"
        style={{ backgroundColor: "#111111", borderColor: "#2B2C2D" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div
                className="w-8 h-8 rounded-lg animate-pulse"
                style={{ backgroundColor: "#2B2C2D" }}
              />
              <div
                className="h-4 rounded w-24 animate-pulse"
                style={{ backgroundColor: "#2B2C2D" }}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // User not signed in
  if (!user) {
    return (
      <header
        className="w-full border-b"
        style={{ backgroundColor: "#18191A", borderColor: "#2B2C2D" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#2B2C2D" }}
              >
                <SVGLogo />
              </div>
              <span className="text-white font-medium text-lg">VideoVault</span>
            </div>
            <Link
              className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-80"
              style={{ backgroundColor: "#2B2C2D" }}
              href="sign-in"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="w-full border-b sticky top-0 z-50"
      style={{ backgroundColor: "#18191A", borderColor: "#2B2C2D" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 ml-6 relative w-8 h-8">
              <Image
                src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                alt={user.user_metadata?.full_name || "User"}
                fill
                className="rounded-full border border-gray-600 object-cover"
                onError={() => {
                  setUser((prev) =>
                    prev
                      ? {
                          ...prev,
                          user_metadata: {
                            ...prev.user_metadata,
                            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.user_metadata?.full_name || "User"
                            )}&background=2B2C2D&color=ffffff&size=32`,
                          },
                        }
                      : prev
                  );
                }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-medium md:text-[18px]">
                Welcome {getFirstName(user.user_metadata?.full_name || "")}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-80"
              style={{ backgroundColor: "#2B2C2D" }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
