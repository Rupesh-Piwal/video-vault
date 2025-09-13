"use client";
import Header from "@/components/Header";
import { UploadModal } from "@/components/upload-modal";
import { useState } from "react";

export default function Page() {

  return (
    <div>
      <Header/>

      {/* <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        // onUploadComplete={handleUploadComplete}
      /> */}
    </div>
  );
}
