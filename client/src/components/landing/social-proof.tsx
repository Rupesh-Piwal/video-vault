"use client";

import { motion } from "motion/react";

export function SocialProof() {
  return (
    <section className="py-24 md:py-32 bg-white flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <h2 className="text-xl md:text-2xl font-medium text-[#0A0A0A] tracking-tight">
            Built for developers shipping video at scale
          </h2>
          <p className="text-sm text-gray-500 font-medium tracking-tight">
            Simple infrastructure for modern video workflows
          </p>
        </motion.div>
      </div>
    </section>
  );
}
