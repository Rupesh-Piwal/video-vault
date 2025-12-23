"use client";

import { motion } from "motion/react";
import { Laptop, CloudUpload, Layers, Settings, Database, Link2 } from "lucide-react";

const architectureNodes = [
  { icon: Laptop, label: "Client" },
  { icon: CloudUpload, label: "S3 Upload" },
  { icon: Layers, label: "Queue" },
  { icon: Settings, label: "Worker" },
  { icon: Database, label: "Storage" },
  { icon: Link2, label: "Share Links" },
];

export function ArchitectureSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg-black to-bg-dark-base">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-text-gray-muted">
            From upload to sharing, fully automated
          </p>
        </motion.div>

        {/* Desktop Flow */}
        <div className="hidden lg:flex items-center justify-between relative">
          {architectureNodes.map((node, index) => (
            <div key={node.label} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="w-24 h-24 rounded-2xl bg-glass-bg backdrop-blur-md border border-glass-border flex flex-col items-center justify-center group-hover:border-neon-purple/50 transition-all">
                  <node.icon className="w-8 h-8 text-neon-purple mb-2" />
                  <span className="text-xs text-text-gray-light font-medium">
                    {node.label}
                  </span>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-neon-purple/0 group-hover:bg-neon-purple/10 blur-xl transition-all" />
              </motion.div>

              {/* Connection Arrow */}
              {index < architectureNodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  className="relative mx-4 flex items-center"
                >
                  <svg
                    width="80"
                    height="2"
                    className="relative"
                  >
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <motion.line
                      x1="0"
                      y1="1"
                      x2="80"
                      y2="1"
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="2"
                      animate={{
                        strokeDashoffset: [0, -20],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      strokeDasharray="10 10"
                    />
                  </svg>
                  
                  {/* Arrow Head */}
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-neon-purple/80" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-6">
          {architectureNodes.map((node, index) => (
            <div key={node.label}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="p-6 rounded-2xl bg-glass-bg backdrop-blur-md border border-glass-border flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center">
                    <node.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">
                    {node.label}
                  </span>
                </div>
              </motion.div>

              {index < architectureNodes.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-neon-purple to-electric-blue" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}