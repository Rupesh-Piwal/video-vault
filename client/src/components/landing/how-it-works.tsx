"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTag } from "./section-tag";
import { ArrowRight, CornerDownRight, Link as LinkIcon } from "lucide-react";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      number: "1",
      title: "Upload",
      description: "Upload large video files seamlessly via our resilient multipart API.",
      detailTitle: "Efficient multipart uploads",
      detailPoints: [
        "Chunked standard & resumable uploads",
        "Direct-to-S3 infrastructure",
        "Parallelized chunk streams via workers",
        "Automatic retries for dropped packets"
      ],
      Visual: () => (
        <div className="flex flex-col gap-6 text-xs text-[#0A0A0A] w-full mt-4">
          {/* Animated Progress Bar Representation */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
            <motion.div
              className="bg-black h-full"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "40%", "80%", "100%"] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-gray-500 text-[11px] uppercase tracking-wider mb-6">
            <span>Uploading chunk 42 of 105</span>
            <span className="text-black font-semibold">1.2 GB / 3.4 GB</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 ">
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-5 h-5 bg-black/10 rounded-sm border border-black/10 shadow-sm"></motion.span>
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-5 h-5 bg-black/10 rounded-sm border border-black/10 shadow-sm"></motion.span>
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-5 h-5 bg-black/10 rounded-sm border border-black/10 shadow-sm"></motion.span>
            </div>
            <ArrowRight size={14} className="text-gray-400 mx-2" />
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm font-medium">S3 Bucket</div>
            <ArrowRight size={14} className="text-gray-400 mx-2" />
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm font-medium">Merge Hook</div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      number: "2",
      title: "Process",
      description: "Videos are asynchronously transcoded and compressed by background workers.",
      detailTitle: "Asynchronous processing pipeline",
      detailPoints: [
        "Auto-triggered upon complete upload",
        "Jobs pushed to Redis/BullMQ queue",
        "Hardware-accelerated transcoding",
        "Predictable idempotent processing"
      ],
      Visual: () => (
        <div className="flex flex-col justify-center h-full text-xs font-mono text-[#0A0A0A] w-full mt-4">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between w-[200px]">
              <span>Ingest API</span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <div className="ml-8 w-px h-6 bg-gray-300"></div>
            <div className="px-3 py-2 bg-black text-white rounded-lg shadow-md flex items-center justify-between w-[220px] ml-8">
              <span className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                Queue (Redis)
              </span>
              <span className="text-white/60">Jobs: 4</span>
            </div>
            <div className="ml-16 w-px h-6 bg-gray-300"></div>
            <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between w-[240px] ml-16">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
                Transcoding Worker
              </span>
              <span className="text-gray-400">720p · 1080p</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      number: "3",
      title: "Deliver",
      description: "Stream instantly via scalable edge delivery networks and secure links.",
      detailTitle: "Secure and scalable delivery",
      detailPoints: [
        "Instant MP4 & HLS shareable links",
        "Public or signed private access URLs",
        "Expiring access controls (1h, 12h, 1d)",
        "Global edge CDN cached delivery"
      ],
      Visual: () => (
        <div className="flex flex-col items-center justify-center h-full gap-8 text-xs font-mono text-[#0A0A0A] w-full mt-4">
          <div className="w-full relative py-6 border border-dashed border-gray-300 bg-white/50 rounded-xl flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <LinkIcon size={18} className="text-[#0A0A0A]" />
              </motion.div>
              <span className="text-sm font-medium tracking-tight">https://vidvault.app/v/a1B2c</span>
            </div>
          </div>

          <div className="flex w-full items-center justify-between px-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans">Viewer</span>
            </div>
            <ArrowRight size={16} className="text-gray-300" />
            <div className="px-5 py-2.5 bg-[#0A0A0A] text-white rounded-lg shadow-lg flex gap-2 items-center hover:bg-[#1a1a1a] cursor-pointer transition-colors font-sans font-medium text-sm">
              ▶ Start Stream
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-16 md:mb-20 text-center flex flex-col items-center">
          <SectionTag label="Architecture" />
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#0A0A0A] mt-1 mb-3 leading-tight">
            How Videovault works?
          </h2>
          <p className="text-lg text-gray-500 text-center max-w-2xl leading-relaxed">
            From raw file to secure shareable link in seconds. <br /> See how VidVault processes your videos behind the scenes.
          </p>
        </div>

        {/* Dynamic Interactive UI - Left Tabs / Right Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Left Column: Interactive Tab List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`text-left p-6 sm:p-8 rounded-3xl transition-all duration-300 group border h-full ${isActive
                      ? 'bg-white border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.06)]'
                      : 'bg-[#FAFAFA] border-transparent hover:bg-black/[0.03]'
                    }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isActive ? 'bg-[#0A0A0A] text-white shadow-md' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300 group-hover:text-[#0A0A0A]'
                      }`}>
                      {step.number}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-[#0A0A0A]' : 'text-gray-500 group-hover:text-[#0A0A0A]'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${isActive ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Column: Dynamic Content Window */}
          <div className="lg:col-span-7 h-full">
            <div className="relative w-full h-[550px] lg:h-full min-h-[500px] bg-[#FAFAFA] border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">

              {/* Subtle Grid Background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full flex flex-col"
                >

                  {/* Top Half: Visual */}
                  <div className="flex-1 p-8 sm:p-12 flex items-center justify-center border-b border-gray-200 bg-white">
                    {steps[activeStep].Visual()}
                  </div>

                  {/* Bottom Half: Detailed Specs */}
                  <div className="h-[220px] p-8 sm:p-10 bg-[#FAFAFA] flex flex-col justify-center">
                    <h4 className="font-semibold text-lg text-[#0A0A0A] mb-5 font-sans tracking-tight">
                      {steps[activeStep].detailTitle}
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                      {steps[activeStep].detailPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CornerDownRight size={14} className="text-[#0A0A0A]/40 mt-1 shrink-0" />
                          <span className="text-sm font-medium text-gray-500 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
