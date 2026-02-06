"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/components/header/header";
import Testimonals02Page from "@/components/landing/components/features/page";
import CaseStudy from "@/components/landing/components/case-study/page";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <Testimonals02Page />
      <CaseStudy />
      <CTASection />
      <Footer />
    </div>
  );
}
