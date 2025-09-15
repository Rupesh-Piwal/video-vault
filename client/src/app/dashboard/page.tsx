"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/components/upload-modal";
import { VideoList } from "@/components/video-list";
import { Upload } from "lucide-react";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-white">
      {/* Header */}
      <div className="border-b border-[#2B2C2D] bg-[#18191A]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-white">My Videos</h1>
              <p className="text-[#8C8C8C] text-sm mt-1">
                Manage and organize your video content
              </p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="bg-white text-black hover:bg-[#424242] hover:text-white transition-all duration-200 rounded-lg px-6 py-2.5 font-medium cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <VideoList />
      </div>

      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
