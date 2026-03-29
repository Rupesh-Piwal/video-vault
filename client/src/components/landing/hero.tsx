"use client";

import { Upload, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { SectionTag } from "./section-tag";

export function Hero() {
  return (
    <section className="relative overflow-visible w-full pb-0 bg-white pt-24">
      {/* Main Central Column */}
      <div className="relative w-full max-w-[1200px] mx-auto border-l border-r border-gray-200 flex flex-col items-center text-center z-10 pb-0">
        
        {/* Background Dot Pattern (Intentionally kept empty per user's structure) */}
        <div className="absolute inset-0 z-0 flex size-full items-center justify-center pointer-events-none"></div>
        
        {/* Text Content Wrapper */}
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 w-full z-10">
          <SectionTag label="Video Processing" showPing={true} />

          {/* Headlines */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-4xl text-[42px] font-bold tracking-tight text-[#0A0A0A] lg:text-[60px] leading-[1.1] mb-6"
          >
            Video storage & sharing <br />
            <span className="text-gray-400 font-medium tracking-tight">Upload, process, secure.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="max-w-[42rem] text-[16px] md:text-[18px] text-gray-500 mb-8 leading-relaxed font-medium"
          >
            A powerful platform to seamlessly upload large videos, automatically generate thumbnails in the background, and create share links.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-4 mb-20"
          >
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center bg-[#0A0A0A] border border-black px-[28px] py-[14px] text-[15px] font-medium text-white hover:bg-[#1a1a1a] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-[6px] transition-all"
            >
              <Upload size={18} className="mr-2" /> Upload Video
            </Link>
          </motion.div>
        </div>

        {/* Mockup Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative w-full overflow-hidden border-t border-gray-200 bg-white h-[400px] sm:h-[500px]"
        >
          {/* Background Image Layer */}
          <img src="/hero/hero-vid.jpg" alt="Hero background texture" className="absolute inset-0 w-full h-full object-cover z-0 opacity-70" />

          {/* Dashboard Mockup Image Flush with Bottom */}
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[90%] md:w-[90%] md:h-[90%] z-10">
            <Image
              src="/hero/dashboardd.png"
              alt="Requesto Dashboard"
              width={1000}
              height={500}
              quality={100}
              className="w-full h-auto object-cover object-top shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-t-xl border-t border-x border-gray-200/50"
            />
          </div>
        </motion.div>
      </div>

      {/* Hatched Separator Row under Hero Mockup */}
      <div className="w-full relative z-30">
        <div className="w-full max-w-[1200px] mx-auto border-l border-r border-gray-200 h-[42px] relative bg-white" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(200, 200, 200, 0.4) 5px, rgba(200, 200, 200, 0.4) 6px)'
        }}>
          {/* Top horizontal line of hatched row */}
          <div className="absolute top-0 left-[50%] -translate-x-1/2 w-[100vw] h-[1px] bg-gray-200 z-10 pointer-events-none" />
          {/* Bottom horizontal line of hatched row */}
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[100vw] h-[1px] bg-gray-200 z-10 pointer-events-none" />

          {/* Corner crop marks at intersection of top line */}
          <div className="absolute -top-[4px] -left-[4.5px] w-[9px] h-[9px] border-[1.5px] border-black bg-white z-30 pointer-events-none" />
          <div className="absolute -top-[4px] -right-[4.5px] w-[9px] h-[9px] border-[1.5px] border-black bg-white z-30 pointer-events-none" />

          {/* Corner crop marks at intersection of bottom line */}
          <div className="absolute -bottom-[4px] -left-[4.5px] w-[9px] h-[9px] border-[1.5px] border-black bg-white z-30 pointer-events-none" />
          <div className="absolute -bottom-[4px] -right-[4.5px] w-[9px] h-[9px] border-[1.5px] border-black bg-white z-30 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
