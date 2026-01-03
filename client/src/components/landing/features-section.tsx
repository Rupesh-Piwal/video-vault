"use client";

import { CloudUpload, Image, Link2, Mail } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: CloudUpload,
    name: "Multipart Uploads",
    description: "Parallel uploads with S3 presigned URLs.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-2 lg:col-span-1",
    background: (
      <div className="absolute top-4 right-4 h-full w-full overflow-hidden">
        <img
          src="/upload1.png"
          alt="Thumbnail generation"
          className="absolute top-0 right-0 w-[90%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)] transition-all duration-300 group-hover:scale-105"
        />
      </div>
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
          src="/Thumbnail2.png"
          alt="Thumbnail generation"
          className="absolute top-0 right-4 w-[90%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)] transition-all duration-300 group-hover:scale-105"
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
          src="/share-links.png"
          alt="Secure share links"
          className="absolute top-10 right-0 w-[90%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)] transition-all duration-300 group-hover:scale-105"
        />
      </div>
    ),
  },
  {
    Icon: Mail,
    name: "Email Notifications",
    description: "Real-time notifications on private link views.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-2 lg:col-span-1",
    background: (
      <div className="absolute top-0 right-4 h-full w-full overflow-hidden">
        <img
          src="/Email2.png"
          alt="Email notifications"
          className="absolute top-0 right-0 w-[85%] object-contain opacity-60 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] transition-all duration-300 group-hover:scale-105"
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
