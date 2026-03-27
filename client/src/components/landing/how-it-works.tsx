import { Upload, Link as LinkIcon, Play, Shield, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white pt-10 relative border-b border-gray-100 overflow-hidden">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pb-32">
        <div className="flex flex-col items-center justify-center text-center mb-24">
          {/* Tag */}
          <div className="relative mb-8 inline-flex items-center gap-2 px-3 py-1.5 border border-black/5 bg-black/5 font-mono font-thin text-xs text-black mt-20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
            </span>
            HOW IT WORKS
            {/* Top Left */}
            <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-black/15" />
            {/* Top Right */}
            <span className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-black/15" />
            {/* Bottom Left */}
            <span className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-black/15" />
            {/* Bottom Right */}
            <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-black/15" />
          </div>
          <h2 className="text-[32px] sm:text-[44px] font-semibold tracking-tight text-black leading-[1.1] max-w-2xl">
            A fast, automated pipeline for your media.
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-xl">
            From raw file to secure shareable link in seconds. See how VidVault processes your videos behind the scenes.
          </p>
        </div>

        <div className="flex flex-col gap-24 md:gap-32 relative">

          {/* Connecting Line behind steps (Visible on Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent -translate-x-1/2 z-0" />

          {/* Step 1: Upload */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 relative z-10">
            {/* Left Box: Content */}
            <div className="w-full md:w-1/2 md:pr-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center size-10 rounded-full bg-[#1DE9B6]/10 text-[#0CA982] font-bold text-lg border border-[#1DE9B6]/20">
                  1
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Fast Multipart Uploads</h3>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Large files are automatically chunked and uploaded via independent parallel streams to AWS S3, guaranteeing fast and resumable transfers that survive network drops.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="size-1.5 rounded-full bg-black" /> Unlimited file size support
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="size-1.5 rounded-full bg-black" /> Auto-resume interrupted uploads
                </li>
              </ul>
            </div>

            {/* Right Box: Graphic */}
            <div className="w-full md:w-1/2">
              <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 transform transition-transform hover:-translate-y-1 duration-500">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-5 relative">
                    <div className="absolute inset-0 rounded-full border border-[#1DE9B6] animate-ping opacity-20" />
                    <Upload className="size-6 text-gray-600" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Click to upload or drag and drop</h4>
                  <p className="text-sm text-gray-500 mt-2">MP4, WEBM, or MOV (max. 10GB)</p>

                  {/* Mock Progress Bar */}
                  <div className="w-full max-w-sm mt-8 space-y-2.5 bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-left">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-700 truncate">demo_recording_final.mp4</span>
                      <span className="text-[#0CA982] ml-4 bg-[#1DE9B6]/10 px-2 py-0.5 rounded-md">68%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1DE9B6] to-cyan-400 w-[68%] rounded-full relative">
                        <div className="absolute top-0 bottom-0 right-0 w-8 bg-white/40 blur-sm animate-pulse" />
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      24.5 MB of 36.0 MB • 2 seconds left
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Processing */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20 relative z-10">
            {/* Right Box (reads left visually because of row-reverse): Content */}
            <div className="w-full md:w-1/2 md:pl-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-700 font-bold text-lg border border-gray-200">
                  2
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Background Processing</h3>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Dedicated background workers handle heavy processing tasks. Thumbnails are securely generated using high-availability message queues without blocking your workflow.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="size-1.5 rounded-full bg-black" /> Zero UI blocking
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="size-1.5 rounded-full bg-black" /> Pristine thumbnail extraction
                </li>
              </ul>
            </div>

            {/* Left Box: Graphic */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50 bg-[#0A0A0A] group">
                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="size-2.5 rounded-full bg-gray-300"></div>
                  <div className="size-2.5 rounded-full bg-gray-300"></div>
                  <div className="size-2.5 rounded-full bg-gray-300"></div>
                </div>
                <div className="relative">
                  <img src="/hero/dashboardd.png" alt="Dashboard" className="w-full h-auto object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

                  {/* Mock processing overlay */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[260px]">
                    <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <div className="relative size-12 flex items-center justify-center">
                        <svg className="animate-spin size-full text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                          <path className="opacity-75 text-[#1DE9B6]" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <Play className="absolute size-4 text-gray-400 ml-0.5" fill="currentColor" />
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-bold text-gray-900">Processing Media...</span>
                        <span className="block text-xs text-gray-500 font-medium mt-0.5">Extracting Thumbnail</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Sharing */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 relative z-10">
            {/* Left Box: Content */}
            <div className="w-full md:w-1/2 md:pr-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center size-10 rounded-full bg-amber-50 text-amber-600 font-bold text-lg border border-amber-100">
                  3
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Secure Shareable Links</h3>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Once ready, instantly generate public or completely restricted private links. Add password protection, set expiration times, and securely share it with any stakeholder.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="size-1.5 rounded-full bg-black" /> Granular privacy controls
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="size-1.5 rounded-full bg-black" /> Track views securely
                </li>
              </ul>

              <div className="mt-8 flex items-center">
                <button className="inline-flex items-center text-sm font-bold text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity">
                  View Demo <ArrowRight className="ml-1.5 size-4" />
                </button>
              </div>
            </div>

            {/* Right Box: Graphic */}
            <div className="w-full md:w-1/2">
              <div className="relative h-[320px] sm:h-[400px] w-full group perspective-1000">
                {/* Background Layer: Shared Vid Player */}
                <div className="absolute right-0 top-4 w-[75%] sm:w-[80%] rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-700 group-hover:scale-[0.98] group-hover:rotate-y-2 group-hover:-translate-x-2">
                  <div className="h-6 bg-gray-100 border-b border-gray-200" />
                  <img src="/hero/shared-vid.png" alt="Shared Video Player" className="w-full object-cover" />
                </div>

                {/* Foreground Layer: Link Generation Modal */}
                <div className="absolute left-0 bottom-4 w-[65%] sm:w-[70%] rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-700 hover:z-20 group-hover:-translate-y-4 group-hover:scale-[1.02]">
                  <div className="h-6 bg-gray-50 border-b border-gray-100 flex items-center px-3">
                    <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Share settings</span>
                  </div>
                  <img src="/hero/gen-links.png" alt="Generate Links Modal" className="w-full object-cover" />
                </div>

                {/* Floating UI Element */}
                <div className="absolute -right-4 bottom-16 bg-white border border-gray-100 rounded-lg p-3 shadow-xl flex items-center gap-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <div className="size-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <LinkIcon className="size-4" />
                  </div>
                  <div className="pr-2">
                    <div className="text-xs font-bold text-gray-900">Link Copied</div>
                    <div className="text-[10px] text-gray-500">Anyone with link can view</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
