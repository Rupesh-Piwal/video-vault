"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Upload, Sparkles } from "lucide-react";
import LiquidEther from "./components/liquid-ether";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* 🔥 Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* 🌑 Dark Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-purple-900/40 to-black/90" />

      {/* ✨ Floating Glow Shapes */}
      <motion.div
        className="absolute top-20 left-10 z-10 w-96 h-96 rounded-full bg-neon-purple/30 blur-3xl"
        animate={{
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-20 right-10 z-10 w-[500px] h-[500px] rounded-full bg-electric-blue/25 blur-3xl"
        animate={{
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🧠 CONTENT */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-neon-purple" />
              <span className="text-xs sm:text-sm text-white/90 font-medium">
                Production-ready video infrastructure
              </span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight px-4">
              Video processing <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-neon-purple via-electric-blue to-neon-purple bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  made simple
                </span>
                <motion.div
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-purple rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 sm:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed px-4"
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
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-electric-blue rounded-2xl opacity-75 group-hover:opacity-100 blur transition-all" />

                {/* Main upload box */}
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border-2 border-dashed border-neon-purple/40 group-hover:border-neon-purple/60 rounded-2xl p-8 sm:p-12 transition-all">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center shadow-lg shadow-neon-purple/50">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-neon-purple/30 blur-xl animate-pulse" />
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
                    <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-neon-purple to-deep-purple text-white font-semibold shadow-lg shadow-neon-purple/50 text-base sm:text-lg group-hover:shadow-neon-purple/70 transition-shadow">
                      <Upload className="w-5 h-5" />
                      <span>Browse Files</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Simple Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto px-4"
          >
            {/* Glow Effect Behind Video */}
            <div className="absolute -inset-4 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-purple rounded-3xl opacity-20 blur-3xl" />

            {/* Video Container */}
            <div className="relative group">
              {/* Border Gradient */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-purple via-electric-blue to-neon-purple rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Video Box */}
              <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                  poster="/dashboard.png"
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add gradient animation to CSS */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
