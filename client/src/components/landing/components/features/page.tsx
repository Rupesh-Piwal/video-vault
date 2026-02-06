import { CloudUpload, Image, Link2 } from "lucide-react";
import { Features } from "./features";

const data = [
  {
    id: 1,
    title: "1. Multipart Uploads",
    content: "Parallel uploads with S3 presigned URLs.",
    image:
      "./multipart-uploads.gif",
    icon: <CloudUpload className="text-primary size-6" />,
  },
  {
    id: 2,
    title: "2. Thumbnail Generation",
    content:
      "Automatic frame extraction and thumbnail creation for quick video previews.",
    image:
      "./thumbnail-generation.gif",
    icon: <Image className="text-primary size-6" />,
  },
  {
    id: 3,
    title: "3. Secure Share Links",
    content:
      "Public, private, and expiry-based sharing with granular access control.",
    image:
      "./share-links.png",
    icon: <Link2 className="text-primary size-6" />,
  },
];

export default function Testimonals02Page() {
  return (
    <div id="features" className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-full">
        <div className="text-center mb-16">
          <p className="text-[#4E4F4E] font-thin text-[28px] md:text-[40px] tracking-widest mb-8">
            FEATURES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
            Key system components
          </h2>
          <p className="text-[15px] md:text-[22px] text-text-gray-muted max-w-2xl mx-auto font-thin tracking-wide">
            The main pieces that make the video upload and sharing flow work.
          </p>
        </div>
        <Features data={data} />
      </div>
    </div>
  );
}
