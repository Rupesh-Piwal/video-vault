import Link from "next/link";

export function Header() {
  return (
    <header className="w-full relative z-40 overflow-hidden bg-white pb-1">
      {/* Top Header Row */}
      <div className="w-full max-w-[1200px] mx-auto border-l border-r border-gray-200 relative bg-white">
        <div className="flex items-center justify-between h-[80px] px-6 sm:px-10">
          {/* Actionable horizontal line stretching to infinity */}
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[1200px] h-[1px] bg-gray-200 z-10 pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-2 relative z-20 bg-white pr-4">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="11" fill="#18181B" />
              <path
                d="M7 11.5L16.5 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M7.5 18L17 12.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M7 15L13 11.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
            <span
              className="text-[20px] font-bold text-[#18181B] tracking-tight"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              VidVault
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-8 relative z-20 bg-white px-4 pt-1">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              How it Works
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 relative z-20 bg-white pl-4">
            <Link
              href="/dashboard"
              className="text-[13px] font-medium text-white bg-gradient-to-b from-[#222] to-[#000] border border-black px-[24px] py-[8px] hover:from-black hover:to-black transition-colors shadow-[0_2px_5px_rgba(0,0,0,0.2)] rounded-[3px]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Hatched Pattern Row */}
      <div className="w-full relative z-30">
        <div
          className="w-full max-w-[1200px] mx-auto border-l border-r border-gray-200 h-[42px] relative bg-white"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(200, 200, 200, 0.4) 5px, rgba(200, 200, 200, 0.4) 6px)",
          }}
        >
          {/* Infinite horizontal line below the hatched row */}
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[100vw] h-[1px] bg-gray-200 z-10 pointer-events-none" />

          {/* Corner crop marks exactly matching image_2 */}
          <div className="absolute -bottom-[3.5px] -left-[4.5px] w-[9px] h-[9px] border-[1.5px] border-black bg-white z-30 pointer-events-none" />
          <div className="absolute -bottom-[3.5px] -right-[4.5px] w-[9px] h-[9px] border-[1.5px] border-black bg-white z-30 pointer-events-none" />
        </div>
      </div>
    </header>
  );
}
