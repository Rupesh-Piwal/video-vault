"use client";

import { motion } from "motion/react";
import { Upload, Image, RefreshCw, Link2, Mail, Lock } from "lucide-react";

const architectureNodes = [
  {
    icon: Upload,
    label: "Upload Video",
    description: "Select and upload videos in any format",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Image,
    label: "Generate Thumbnails",
    description: "AI-powered thumbnail creation",
    color: "from-violet-500 to-indigo-600",
  },
  {
    icon: RefreshCw,
    label: "Background Processing",
    description: "Queue-based video processing",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Link2,
    label: "Create Share Links",
    description: "Public & private video links",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Lock,
    label: "Access Control",
    description: "Whitelist management",
    color: "from-cyan-500 to-teal-600",
  },
  {
    icon: Mail,
    label: "Email Notifications",
    description: "Queue-based email delivery",
    color: "from-teal-500 to-emerald-600",
  },
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
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Complete Video Pipeline
          </h2>
          <p className="text-lg text-text-gray-muted max-w-2xl mx-auto">
            From upload to secure sharing with automated thumbnail generation,
            background processing, and intelligent notifications
          </p>
        </motion.div>

        {/* Desktop Flow - Grid Layout */}
        <div className="hidden lg:grid grid-cols-3 gap-8 relative">
          {architectureNodes.map((node, index) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card */}
              <div className="relative p-8 rounded-3xl bg-glass-bg backdrop-blur-md border border-glass-border hover:border-neon-purple/50 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-neon-purple/50">
                  {index + 1}
                </div>

                {/* Icon with Gradient Background */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <node.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {node.label}
                </h3>
                <p className="text-sm text-text-gray-light leading-relaxed">
                  {node.description}
                </p>

                {/* Visual Indicator for Queue Steps */}
                {(index === 2 || index === 5) && (
                  <div className="mt-4 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30 inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                    <span className="text-xs text-neon-purple font-medium">
                      Queue System
                    </span>
                  </div>
                )}

                {/* Visual Indicator for Private Links */}
                {index === 4 && (
                  <div className="mt-4 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 inline-flex items-center gap-2">
                    <Lock className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-500 font-medium">
                      Whitelist Only
                    </span>
                  </div>
                )}

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-purple/0 to-electric-blue/0 group-hover:from-neon-purple/5 group-hover:to-electric-blue/5 transition-all duration-300 pointer-events-none" />
              </div>

              {/* Connection Lines */}
              {index < architectureNodes.length - 1 && (
                <>
                  {/* Horizontal line for same row */}
                  {index % 3 !== 2 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className="absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-neon-purple to-electric-blue origin-left"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-electric-blue" />
                    </motion.div>
                  )}

                  {/* Vertical line for column transitions */}
                  {index === 2 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-electric-blue to-neon-purple origin-top"
                    >
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-b-2 border-r-2 border-neon-purple" />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-4">
          {architectureNodes.map((node, index) => (
            <div key={node.label} className="relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl bg-glass-bg backdrop-blur-md border border-glass-border">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-neon-purple/50">
                    {index + 1}
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <node.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-white font-semibold mb-2">
                        {node.label}
                      </h3>
                      <p className="text-sm text-text-gray-light">
                        {node.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(index === 2 || index === 5) && (
                          <div className="px-2 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30 inline-flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
                            <span className="text-xs text-neon-purple font-medium">
                              Queue
                            </span>
                          </div>
                        )}
                        {index === 4 && (
                          <div className="px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 inline-flex items-center gap-1">
                            <Lock className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-500 font-medium">
                              Whitelist
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {index < architectureNodes.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-neon-purple to-electric-blue relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-b-2 border-r-2 border-electric-blue" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
