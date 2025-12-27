"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function CTASection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-to-b from-bg-black to-bg-dark-base opacity-20" />

      {/* Animated Glow Orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-neon-purple/30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-electric-blue/30 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Built for real-world
            <br />
            <span className="bg-gradient-to-r from-neon-purple to-electric-blue bg-clip-text text-transparent">
              video workloads.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-text-gray-light mb-12 max-w-2xl mx-auto">
            Start processing videos at scale with enterprise-grade
            infrastructure
          </p>

          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 rounded-xl bg-white text-deep-purple font-bold text-lg shadow-2xl shadow-neon-purple/50 hover:shadow-neon-purple/70 transition-shadow cursor-pointer"
            >
              Launch VidVault
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
