"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/components/header/header";
import ScrollElement from "../../components/uilayouts/scroll-animation";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <ScrollElement viewport={{ once: true, amount: 0.5 }}>
        <HeroSection />
      </ScrollElement>

      <FeaturesSection />

      <ArchitectureSection />

      <CTASection />

      <Footer />
    </div>
  );
}
