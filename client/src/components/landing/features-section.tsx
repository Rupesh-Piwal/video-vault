"use client";

import { motion } from "motion/react";
import { CloudUpload, Settings, Image, Link2, Mail } from "lucide-react";
import { ReactNode } from "react";

interface Feature {
  icon: any;
  title: string;
  description: string;
  className?: string;
  background?: ReactNode;
}

const features: Feature[] = [
  {
    icon: CloudUpload,
    title: "Multipart Uploads",
    description:
      "Resumable & parallel uploads with S3 presigned URLs. Handle large files efficiently with automatic chunking and retry logic.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Image,
    title: "Thumbnail Generation",
    description: "Automatic frame extraction and thumbnail creation",
    className: "md:col-span-3 md:row-span-2",
  },
  {
    icon: Link2,
    title: "Secure Share Links",
    description:
      "Public, private, and expiry-based sharing with granular access control",
    className: "md:col-span-3 md:row-span-2",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description:
      "Real-time notifications on private link views and video processing status",
    className: "md:col-span-2 md:row-span-2",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Production-Ready Features
          </h2>
          <p className="text-lg text-text-gray-muted max-w-2xl mx-auto">
            Everything you need for enterprise-grade video infrastructure
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-5 gap-6 auto-rows-[minmax(240px,auto)]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group relative ${feature.className || ""}`}
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full p-8 rounded-2xl bg-glass-bg backdrop-blur-md border border-glass-border hover:border-neon-purple/50 transition-all duration-300 overflow-hidden">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/0 to-electric-blue/0 group-hover:from-neon-purple/10 group-hover:to-electric-blue/10 transition-all duration-300" />

                {/* Background Pattern for Large Card */}
                {index === 0 && (
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 right-10 w-32 h-32 border-2 border-neon-purple rounded-xl rotate-12" />
                    <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-electric-blue rounded-xl -rotate-12" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-violet-accent rounded-full" />
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center shadow-lg shadow-neon-purple/50 group-hover:shadow-neon-purple/70 transition-shadow">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-white mb-3 ${
                        index === 0 ? "text-2xl" : "text-xl"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className={`text-text-gray-muted leading-relaxed ${
                        index === 0 ? "text-base" : "text-sm"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Arrow for Large Card */}
                  {index === 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 text-neon-purple group-hover:text-electric-blue transition-colors text-sm font-medium">
                      Learn more
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
