"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export const dynamic = "force-dynamic";

export default function Page() {
  const router = useRouter();
  const supabase = createClient();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [supabase, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-neon-purple border-t-transparent animate-spin" />
          <p className="text-text-gray-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-black">
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <CTASection />
      <Footer />
    </div>
  );
}