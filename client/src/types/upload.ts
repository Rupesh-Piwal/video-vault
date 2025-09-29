export interface UploadFile {
  id: string;
  file?: File | null;
  progress: number;
  status: "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
  error: string | null;
  videoId?: string;
}

export interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (files: UploadFile[]) => void;
}
