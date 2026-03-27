"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-visible w-full  pb-0 bg-white">


      {/* Main Central Column */}
      <div className="relative w-full max-w-[1100px] mx-auto border-l border-r border-gray-200 flex flex-col items-center text-center z-10  pb-0">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 flex size-full items-center justify-center pointer-events-none">
        </div>
        {/* Tag */}
        <div className="relative mb-8 mt-10 inline-flex items-center gap-2 px-3 py-1.5 border border-black/5 bg-black/5 font-mono font-thin text-xs text-black">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
          </span>
          Video Processing
          {/* Top Left */}
          <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-black/15" />
          {/* Top Right */}
          <span className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-black/15" />
          {/* Bottom Left */}
          <span className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-black/15" />
          {/* Bottom Right */}
          <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-black/15" />
        </div>

        {/* Text Content Wrapper */}
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 w-full">

          {/* Headlines */}
          <h1 className="max-w-4xl text-[38px] font-bold tracking-tighter text-black lg:text-[56px] leading-[1.05] mb-6">
            Video storage & sharing <br />
            <span className="text-[#a1a1aa] font-medium tracking-tight">Upload, process, secure</span>
          </h1>

          <p className="max-w-[42rem] text-[14px] md:text-[18px] text-[#555] mb-6 leading-relaxed font-medium">
            A powerful platform to seamlessly upload large videos, automatically generate thumbnails in the background, and create share links.
          </p>

          {/* CTA */}
          <Link href="/dashboard" className="inline-flex items-center justify-center bg-gradient-to-b from-[#333] to-black border border-black px-[28px] py-[14px] text-[15px] font-medium text-white hover:opacity-90 rounded-[4px] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] mb-10">
            <Upload size={18} className="mr-2" />   Upload Video
          </Link>
        </div>

        {/* Mockup Container */}
        <div className="relative w-full overflow-hidden border-t border-gray-200 bg-white h-[400px] sm:h-[500px]">
          {/* Background Image Layer */}
          <img src="/hero/hero-vid.jpg" alt="Hero background texture" className="absolute inset-0 w-full h-full object-cover z-0 opacity-70" />

          {/* Dashboard Mockup Image Flush with Bottom */}
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[90%] md:w-[90%] md:h-[90%] z-10">
            <Image
              src="/hero/dashboardd.png"
              alt="Requesto Dashboard"
              width={500}
              height={250}
              className="w-full shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
            />
          </div>
        </div>
      </div>

      {/* Hatched Separator Row under Hero Mockup */}
      <div className="w-full relative z-30">
        <div className="w-full max-w-[1100px] mx-auto border-l border-r border-gray-200 h-[42px] relative bg-white" style={{
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
