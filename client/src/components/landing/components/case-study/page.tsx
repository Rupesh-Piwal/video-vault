"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const caseStudies = [
  {
    id: "hvac-optimization",
    title: "HVAC Vent Optimization",
    description: "AI-optimized vent placement improving air circulation and reducing stagnant zones.",
    image: "/hvac-optimization.png",
    metrics: [
      { label: "FASTER", value: "240x" },
      { label: "BETTER FLOW", value: "40%" },
    ],
  },
  {
    id: "coastal-infrastructure",
    title: "Coastal Infrastructure",
    description: "Optimized sea wall design validated across 150+ iterations.",
    image: "/coastal-infrastructure.png",
    metrics: [
      { label: "ITERATIONS", value: "150+" },
      { label: "LESS STRESS", value: "13%" },
    ],
  },
];

const CaseStudy = () => {
  return (
    <section id="case-studies" className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h3 className="text-sm font-semibold tracking-widest text-[#4A4A4A] uppercase mb-4">
            RESULTS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#A1A1A1]">
            Case Studies
          </h2>
          <p className="text-[#A1A1A1] text-lg max-w-2xl mx-auto">
            Real-world deployments with measurable impact.
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
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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

                {/* Metrics */}
                <div className="flex gap-12">
                  {study.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="text-[10px] font-bold tracking-widest text-[#4A4A4A] uppercase">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

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