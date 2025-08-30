"use client";
import Header from "@/components/Header";
import { UploadModal } from "@/components/upload-modal";
import { useState } from "react";

export default function Page() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false); 

  return (
    <div>
      <Header onOpenUpload={() => setUploadModalOpen(true)} />

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        // onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
