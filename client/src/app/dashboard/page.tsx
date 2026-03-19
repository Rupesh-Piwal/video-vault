"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, Search } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { VideoList } from "./components/video-list";
import { UploadModal } from "./components/upload-modal";
import { TextShimmer } from "../../../components/motion-primitives/text-shimmer";
import VideoIcon from "./components/ui/video-icon";
import { useDebounce } from "@/hooks/useDebounce";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const router = useRouter();

  const debouncedInput = useDebounce({
    input,
    delay: 300,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/sign-in");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/sign-in");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070709] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-4 flex-1">
              {/* TITLE */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <VideoIcon />
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                    My Videos
                  </h1>
                </div>

                <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                  Manage & organize your videos
                </p>
              </div>

              {/* SEARCH */}
              <div className="hidden md:flex flex-1 justify-center">
                <div className="relative w-full max-w-md group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />

                  <input
                    type="text"
                    value={input}
                    onChange={handleSearch}
                    placeholder="Search videos..."
                    className="
                    w-full
                    pl-10 pr-4 py-2.5
                    rounded-xl
                    bg-white/5
                    border border-white/10
                    text-sm text-white
                    placeholder:text-gray-500
                    outline-none
                    transition-all duration-200
                    backdrop-blur-md
                    hover:border-white/20
                    focus:border-white/30
                    focus:bg-white/10
                    focus:ring-2 focus:ring-white/10
                  "
                  />
                </div>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2">
              {/* Upload */}
              <Button
                onClick={() => setOpen(true)}
                className="
                rounded-xl px-4 py-2
                bg-white text-black
                hover:bg-white/90
                font-medium
                transition-all duration-200
                shadow-lg hover:shadow-xl
              "
              >
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Button>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="
                rounded-xl px-3 py-2
                text-gray-400 hover:text-white
                hover:bg-white/10
                transition-all duration-200
              "
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="mt-4 md:hidden">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white" />

              <input
                type="text"
                value={input}
                onChange={handleSearch}
                placeholder="Search videos..."
                className="
                w-full
                pl-10 pr-4 py-2.5
                rounded-xl
                bg-white/5
                border border-white/10
                text-sm text-white
                placeholder:text-gray-500
                outline-none
                backdrop-blur-md
                transition-all duration-200
                focus:border-white/30
                focus:bg-white/10
              "
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative">
        {/* subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VideoList
            input={debouncedInput}
            onUploadClick={() => setOpen(true)}
          />
        </div>
      </main>

      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
