"use client";

import { motion } from "motion/react";

interface SectionTagProps {
  label: string;
  showPing?: boolean;
}

export function SectionTag({ label, showPing = false }: SectionTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mb-8 inline-flex items-center gap-2 px-3 py-1.5 border border-black/5 bg-black/5 font-mono text-[11px] uppercase tracking-wider text-[#0A0A0A]"
    >

      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-60"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
      </span>

      {label}
      {/* Top Left */}
      <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-black/15" />
      {/* Top Right */}
      <span className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-black/15" />
      {/* Bottom Left */}
      <span className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-black/15" />
      {/* Bottom Right */}
      <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-black/15" />
    </motion.div>
  );
}
