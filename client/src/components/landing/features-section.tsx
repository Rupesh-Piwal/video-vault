"use client";

import { motion } from "motion/react";
import { CloudUpload, Settings, Image, Link2, Mail } from "lucide-react";

const features = [
  {
    icon: CloudUpload,
    title: "Multipart Uploads",
    description: "Resumable & Parallel",
  },
  {
    icon: Settings,
    title: "Background Processing",
    description: "BullMQ + Redis Workers",
  },
  {
    icon: Image,
    title: "Thumbnail Generation",
    description: "Automatic frame extraction",
  },
  {
    icon: Link2,
    title: "Secure Share Links",
    description: "Public / Private / Expiry",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description: "On private link views",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Production-Ready Features
          </h2>
          <p className="text-lg text-text-gray-muted max-w-2xl mx-auto">
            Everything you need for enterprise-grade video infrastructure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full p-8 rounded-2xl bg-glass-bg backdrop-blur-md border border-glass-border hover:border-neon-purple/50 transition-all duration-300">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/0 to-electric-blue/0 group-hover:from-neon-purple/10 group-hover:to-electric-blue/10 transition-all duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center shadow-lg shadow-neon-purple/50">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-text-gray-muted">
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