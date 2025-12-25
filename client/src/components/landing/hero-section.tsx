"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Upload } from "lucide-react";
import DarkVeil from "./components/dark-veil";
import { TextShimmer } from "../../../components/motion-primitives/text-shimmer";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-8 ">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-white/90 font-medium">
                <TextShimmer>Production-ready video infrastructure</TextShimmer>
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-2xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight px-4">
              Video processing <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="text-[#FFFFFF] animate-gradient bg-[length:200%_auto]">
                  made simple
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center text-base sm:text-lg md:text-[18px] lg:text-[18px] text-slate-200 mb-10 sm:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Upload videos at scale with multipart transfers, process with
            background workers, and share with secure, customizable links.
          </motion.p>

          {/* Upload CTA Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center mb-12 sm:mb-16 lg:mb-20"
          >
            <Link href="/sign-up" className="w-full max-w-xl px-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
              >
                {/* Main upload box */}
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-dashed border-[#1F0D5D] group-hover:border-[#4E25F4] rounded-2xl p-8 sm:p-12 transition-all">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#210E66] to-[#4E25F4] flex items-center justify-center shadow-lg">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-[#210E66] blur-xl animate-pulse" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                      Choose a video or drag & drop it here
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-6">
                      Any video format supported - MP4, MKV, AVI, MOV, HEVC, and
                      more, up to 300MB
                    </p>

                    {/* Button */}
                    <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#210E66] to-[#4E25F4] text-white font-semibold text-base sm:text-lg  transition-shadow">
                      <Upload className="w-5 h-5" />
                      <span>Browse Files</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
