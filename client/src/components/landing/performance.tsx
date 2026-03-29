"use client";

import { Check } from "lucide-react";
import { SectionTag } from "./section-tag";

export function Performance() {
  const points = [
    { title: "Reliable uploads", description: "Zero packet loss via edge routing." },
    { title: "Fast processing", description: "Parallel GPU encoding cuts wait time." },
    { title: "Secure delivery", description: "AES-256 encrypted distribution." },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col items-center">
        <SectionTag label="Architecture" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0A0A0A] mb-16 mt-2 text-center">
          Built for speed at scale
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16 w-full max-w-4xl">
          {points.map((point, index) => (
            <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="mb-4 bg-[#FAFAFA] border border-gray-200 p-2 rounded-full">
                <Check size={18} className="text-[#0A0A0A]" strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold text-lg text-[#0A0A0A] mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
