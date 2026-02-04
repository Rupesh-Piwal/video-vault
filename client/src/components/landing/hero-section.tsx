"use client";

import { CallToAction } from "./components/ui/cta";

export function HeroSection() {
  return (
    <section className="relative my-18 overflow-hidden flex items-center">
      <div className="mx-auto max-w-7xl">
        <CallToAction />
      </div>
    </section>
  );
}
