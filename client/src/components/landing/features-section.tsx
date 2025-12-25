"use client";

import { CloudUpload, Image, Link2, Mail } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const uploadSteps = [
  {
    name: "chunk-1.mp4",
    status: "Uploading",
    progress: "45%",
  },
  {
    name: "chunk-2.mp4",
    status: "Uploading",
    progress: "78%",
  },
  {
    name: "chunk-3.mp4",
    status: "Pending",
    progress: "0%",
  },
  {
    name: "chunk-4.mp4",
    status: "Complete",
    progress: "100%",
  },
  {
    name: "video-final.mp4",
    status: "Merging",
    progress: "90%",
  },
];

const features = [
  {
    Icon: CloudUpload,
    name: "Multipart Uploads",
    description:
      "Resumable & parallel uploads with S3 presigned URLs. Handle large files efficiently with automatic chunking and retry logic.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-2 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
      >
        {uploadSteps.map((step, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-neon-purple/30 bg-glass-bg backdrop-blur-sm hover:bg-glass-bg/80",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-col gap-2">
              <figcaption className="text-sm font-medium text-white">
                {step.name}
              </figcaption>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-gray-muted">{step.status}</span>
                <span className="text-neon-purple font-semibold">
                  {step.progress}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-bg-card-dark overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-purple to-electric-blue transition-all duration-300"
                  style={{ width: step.progress }}
                />
              </div>
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Image,
    name: "Thumbnail Generation",
    description:
      "Automatic frame extraction and thumbnail creation for quick video previews",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-3 lg:col-span-2",
    background: (
      <div className="absolute top-4 right-0 h-full w-full overflow-hidden">
        <img
          src="/thumbnail.png"
          alt="Thumbnail generation"
          className="absolute top-10 right-0 w-[90%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)] transition-all duration-300 group-hover:scale-105"
        />
      </div>
    ),
  },
  {
    Icon: Link2,
    name: "Secure Share Links",
    description:
      "Public, private, and expiry-based sharing with granular access control",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-3 lg:col-span-2",
    background: (
      <div className="absolute top-4 right-0 h-full w-full overflow-hidden">
        <img
          src="/sharelink.png"
          alt="Secure share links"
          className="absolute top-10 right-0 w-[90%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)] transition-all duration-300 group-hover:scale-105"
        />
      </div>
    ),
  },
  {
    Icon: Mail,
    name: "Email Notifications",
    description:
      "Real-time notifications on private link views and video processing status",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-2 lg:col-span-1",
    background: (
      <div className="absolute top-4 right-0 h-full w-full overflow-hidden">
        <img
          src="/email.png"
          alt="Email notifications"
          className="absolute top-10 right-0 w-[85%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] transition-all duration-300 group-hover:scale-105"
        />
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Production-Ready Features
          </h2>
          <p className="text-lg text-text-gray-muted max-w-2xl mx-auto">
            Everything you need for enterprise-grade video infrastructure
          </p>
        </div>

        <BentoGrid className="auto-rows-[22rem]">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}