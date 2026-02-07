"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const caseStudies = [
  {
    id: "multipart-video-upload",
    title: "Multipart Upload",
    description: "Parallel uploads with S3 presigned URLs.",
    image: "/Multipart Upload_cs.png",
    metrics: [
      { label: "FASTER", value: "240x" },
      { label: "BETTER FLOW", value: "40%" },
    ],
  },
  {
    id: "thumbnail-generation",
    title: "Worker Queues",
    description: "Asynchronous video processing with Redis & FFmpeg.",
    image: "/Async Video Thumbnail Generation.png",
    metrics: [
      { label: "LATENCY", value: "0ms" },
      { label: "SCALE", value: "10k+" },
    ],
  },
];

const CaseStudy = () => {
  return (
    <section
      id="case-studies"
      className="py-24 bg-black text-white overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#4E4F4E] font-thin text-[28px] md:text-[40px] tracking-widest mb-8">
            RESULTS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#A1A1A1]">
            Case Studies
          </h2>
          <p className="text-[#A1A1A1] text-lg max-w-2xl mx-auto">
            Engineering case studies.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/case-study/${study.id}`}
              className="group relative block rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] overflow-hidden transition-all duration-500 hover:border-[#3F3F3F] hover:shadow-[0_0_50px_rgba(255,255,255,0.05)]"
            >
              {/* Image Container */}
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h4 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                  {study.title}
                </h4>
                <p className="text-[#A1A1A1] mb-8 leading-relaxed">
                  {study.description}
                </p>

                {/* Hover CTA */}
                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#A1A1A1] group-hover:text-white transition-colors">
                  View Case Study
                  <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
