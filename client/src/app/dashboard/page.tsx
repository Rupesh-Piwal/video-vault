"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/components/upload-modal";
import { VideoList } from "@/components/video-list";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Videos</h1>
        <Button onClick={() => setOpen(true)}>Upload Video</Button>
      </div>

      <VideoList />

      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
