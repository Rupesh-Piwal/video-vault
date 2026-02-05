"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function CTASection() {
  return (
    <section className="relative my-4 py-4 md:py-8 px-4 lg:px-8 overflow-hidden bg-[#151414] border border-[#282929] max-w-[310px] md:max-w-3xl mx-auto rounded-lg">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-xl md:text-3xl font-bold md:font-semibold text-white mb-4">
            Generate Thumbnails
            <span> and share Videos</span>
          </h2>

          <p className="text-base sm:text-lg text-text-gray-muted mb-10 max-w-2xl mx-auto">
            Upload videos, generate thumbnails, and share public or private
            links.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard">
              <button className="px-6 py-3 rounded-lg bg-white text-bg-black text-sm sm:text-base font-medium hover:bg-white/90 transition cursor-pointer">
                Generate
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
