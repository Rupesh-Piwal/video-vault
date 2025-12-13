"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Upload } from "lucide-react";

import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { VideoList } from "./components/video-list";
import { UploadModal } from "./components/upload-modal";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const supabase = createClient();

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
    <div className="min-h-screen bg-[#111111]">
      <div className="sticky top-0 z-40 border-b border-purple-900/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-violet-200">
                My Videos
              </h1>
              <p className="text-neutral-400 text-sm mt-1.5 hidden sm:block">
                Manage and organize your video content
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => setOpen(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-violet-950 cursor-pointer to-violet-900 hover:from-purple-700 hover:to-violet-700 text-white  hover:shadow-purple-500/40 transition-all duration-200 rounded-xl px-4 sm:px-6 py-2.5 font-medium border border-purple-500/20 hover:scale-105"
              >
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload Video</span>
                <span className="sm:hidden">Upload</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1 sm:flex-none bg-neutral-900/50 hover:bg-neutral-800/80 text-white border-neutral-700/50 hover:border-neutral-600 hover:text-white backdrop-blur-sm transition-all duration-200 rounded-xl px-4 sm:px-6 py-2.5 font-medium hover:scale-105 cursor-pointer"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <LogOut className="h-4 w-4 sm:ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <VideoList />
      </div>
      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
