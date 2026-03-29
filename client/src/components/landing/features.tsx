"use client";

import { motion } from "motion/react";
import { Gauge, ImagePlay, Lock, Server, UploadCloud, ArrowUpRight } from "lucide-react";
import { SectionTag } from "./section-tag";

export function Features() {
  const features = [
    {
      title: "Resilient Multipart Uploads",
      description: "Automatic pause-and-resume handles network drops seamlessly. Even multi-gigabyte video files ingest perfectly across unstable mobile networks without dropping the connection or restarting.",
      icon: UploadCloud,
      className: "md:col-span-2",
      showPattern: true,
    },
    {
      title: "Instant Thumbnails",
      description: "Smart extraction at any precise timestamp via a simple URL parameter.",
      icon: ImagePlay,
      className: "md:col-span-1",
      showPattern: false,
    },

    {
      title: "Zero-Trust Security Models",
      description: "Everything is locked down by default. Generate expiring signed URLs, issue precise permission-based tokens, and restrict sharing to authorized application origins.",
      icon: Lock,
      className: "md:col-span-2",
      showPattern: true,
    },
    {
      title: "High Performance",
      description: "Parallel hardware-accelerated transcoding pipeline.",
      icon: Gauge,
      className: "md:col-span-1",
      showPattern: false,
    },

  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-[#FAFAFA] relative overflow-hidden flex flex-col items-center">

      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#FAFAFA] via-transparent to-[#FAFAFA] opacity-80" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10 w-full">

        {/* Header */}
        <div className="max-w-2xl mb-20 flex flex-col items-start md:items-center md:text-center md:mx-auto">
          <SectionTag label="Features" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0A0A0A] mt-6 mb-6 leading-tight">
            Everything you need.<br className="hidden md:block" />
            <span className="text-gray-400"> Nothing you don't.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
            A complete video stack built explicitly for developers who care about uncompromised performance and deeply flawless user experiences.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative bg-white rounded-3xl border border-black/[0.04] overflow-hidden transition-all duration-500 hover:border-black/[0.1] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${feature.className}`}
            >

              {/* Animated Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Decorative Mesh Pattern for large cards */}
              {feature.showPattern && (
                <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_50%)] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
              )}

              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] border border-gray-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <feature.icon size={22} className="text-[#0A0A0A]" strokeWidth={1.5} />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowUpRight size={14} className="text-gray-400" />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-xl font-bold tracking-tight text-[#0A0A0A] mb-3">
                    {feature.title}
                  </h3>
                  <p className={`text-base leading-relaxed text-gray-500 font-medium ${feature.className.includes('col-span-2') ? 'max-w-xl' : ''}`}>
                    {feature.description}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
