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
  const supabase = createClient();

  const debouncedInput = useDebounce({
    input,
    delay: 300,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    console.log(e.target.value);
  };

  const handleLogout = async () => {
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
    <div className="min-h-screen bg-black">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-purple-900/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex gap-5 items-center">
            {/* LEFT */}
            <div className="flex justify-between flex-1 items-center">
              {/* TITLE */}
              <div className="flex flex-col justify-center-center">
                <div className="flex md:hidden items-center gap-2 text-2xl text-white">
                  <VideoIcon />
                </div>

                <h1 className="hidden md:text-3xl font-bold text-white md:flex items-center gap-3 tracking-wide mb-3">
                  <VideoIcon />
                  My Videos
                </h1>
                <div className="hidden md:block">
                  <TextShimmer>Manage & organize your videos</TextShimmer>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative max-w-md">
                <div className="relative w-full max-w-md group">
                  <Search className="pointer-events-none absolute left-8 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-grey-400" />

                  <input
                    type="text"
                    value={input}
                    onChange={handleSearch}
                    placeholder="Search videos..."
                    className="
      w-full
      md:min-w-[400px]
      pl-10 mx-2 pr-4 py-2.5
      rounded-xl
      bg-transparent
      border border-gray-700
      text-sm text-white
      placeholder:text-gray-500
      outline-none
      transition-all duration-200
      hover:border-gray-500
      focus:border-gray-500
      focus:ring-2 focus:ring-gray-800/30
      focus:bg-gray-900
    "
                  />
                </div>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setOpen(true)}
                className="rounded-xl px-6 bg-[#E5E5E8] text-[#0E0E10] font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer tracking-wide"
              >
                <span className="hidden sm:inline"> Upload Video</span>
                <Upload className="h-4 w-4 sm:ml-2" />
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-neutral-900/50 hover:bg-neutral-800/80 text-white border-neutral-700/50 hover:border-neutral-600 backdrop-blur-sm transition-all rounded-xl px-5 py-2.5 font-medium hover:scale-105 cursor-pointer"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <LogOut className="h-4 w-4 sm:ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoList input={debouncedInput} onUploadClick={() => setOpen(true)} />
      </div>

      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
