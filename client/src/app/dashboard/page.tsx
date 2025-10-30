"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/app/dashboard/components/upload-modal";
import { LogOut, Upload } from "lucide-react";
import { VideoList } from "./components/video-list";
import SVGLogo from "@/components/svg-logo";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-[#0B0D0E] text-white">
      <div className="border-b border-[#2B2C2D] bg-[#18191A]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="md:text-2xl text-xl font-semibold text-white flex items-center gap-2">
                <span className="inline-block md:hidden">
                  <SVGLogo />
                </span>
                My Videos
              </h1>
              <p className="text-[#8C8C8C] text-sm mt-1 hidden md:flex">
                Manage and organize your video content
              </p>
            </div>
            <div className="flex flex-row items-center gap-3">
              <Button
                onClick={() => setOpen(true)}
                className="bg-white text-black hover:bg-[#424242] hover:text-white transition-all duration-200 rounded-lg px-6 py-2.5 font-medium cursor-pointer"
              >
                <Upload className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">Upload Video</span>
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-white text-black hover:bg-[#424242] hover:text-white transition-all duration-200 rounded-lg px-6 py-2.5 font-medium cursor-pointer"
              >
                <span className="hidden md:block">SignOut</span>
                <LogOut className="h-4 w-4 md:mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <VideoList />
      </div>

      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
