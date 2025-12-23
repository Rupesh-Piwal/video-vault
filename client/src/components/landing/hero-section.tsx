"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-black via-deep-purple/20 to-bg-black" />
      
      {/* Floating Abstract Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-neon-purple/10 blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-electric-blue/10 blur-3xl"
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Upload. Process.{" "}
              <span className="bg-gradient-to-r from-neon-purple to-electric-blue bg-clip-text text-transparent">
                Share.
              </span>{" "}
              At Scale.
            </h1>
            
            <p className="text-lg sm:text-xl text-text-gray-light mb-10 max-w-2xl mx-auto lg:mx-0">
              A production-ready video platform with multipart uploads,
              background workers, and secure share links.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-purple to-deep-purple text-white font-semibold shadow-lg shadow-neon-purple/50 hover:shadow-neon-purple/70 transition-shadow"
                >
                  Get Started
                </motion.button>
              </Link>
              
              <a
                href="https://github.com/rupeshpiwal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl border-2 border-glass-border bg-glass-bg backdrop-blur-sm text-white font-semibold hover:border-neon-purple/50 transition-colors"
                >
                  View GitHub
                </motion.button>
              </a>
            </div>
          </motion.div>

          {/* Right Content - Video Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-neon-purple/30 shadow-2xl shadow-neon-purple/20">
              {/* Purple Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-electric-blue/20 blur-xl" />
              
              {/* Video Container */}
              <div className="relative bg-bg-card-dark backdrop-blur-xl">
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
                
                {/* Fallback Image if video not available */}
                <img
                  src="/dashboard.png"
                  alt="VidVault Dashboard Demo"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-neon-purple/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-electric-blue/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}