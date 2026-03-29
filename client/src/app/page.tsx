"use client";

import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";


export default function Page() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans selection:bg-black selection:text-white">
      <Header />
      <Hero />

      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}
