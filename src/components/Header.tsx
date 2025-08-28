"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
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
      <header className="w-full bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200/50 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-200/50 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="w-full bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 ">
            <Link
              className="bg-purple-700 text-white p-2 rounded"
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
    <header className="w-full bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                alt={user.user_metadata?.full_name || "User"}
                className="relative w-10 h-10 rounded-full border-2 border-white/50 shadow-md transition-all duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.user_metadata?.full_name || "User"
                  )}&background=f3f4f6&color=374151&size=40`;
                }}
              />
            </div>

            <div className="hidden sm:block">
              <h2 className="text-lg font-medium text-gray-800">
                Welcome back,{" "}
                {getFirstName(user.user_metadata?.full_name || "")}
              </h2>
              <p className="text-xs text-gray-500 -mt-1">{user.email}</p>
            </div>

            {/* Mobile greeting */}
            <div className="block sm:hidden">
              <h2 className="text-base font-medium text-gray-800">
                {getFirstName(user.user_metadata?.full_name || "")}
              </h2>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <Button
              className="rounded-xl"
              // onClick={() => setUploadModalOpen(true)}
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
