"use client";

import { CallToAction } from "./components/ui/cta";


export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-8 ">
        <div className="mx-auto max-w-7xl">
          	<CallToAction />
        </div>
      </div>
    </section>
  );
}
