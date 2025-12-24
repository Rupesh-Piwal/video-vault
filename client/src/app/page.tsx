"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import ScrollElement from "../../components/uilayouts/scroll-animation";
import Loader from "@/components/kokonutui/loader";
import { Header } from "@/components/landing/components/header/header";


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
          <Loader />
          <p className="text-text-gray-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <ScrollElement
        viewport={{ once: true, amount: 0.5, margin: "0px 0px 0px 0px" }}
      >
        <HeroSection />
      </ScrollElement>
      <ScrollElement
        viewport={{ once: true, amount: 0.5, margin: "0px 0px 0px 0px" }}
      >
        <FeaturesSection />
      </ScrollElement>
      <ScrollElement
        viewport={{ once: true, amount: 0.5, margin: "0px 0px 0px 0px" }}
      >
        <ArchitectureSection />
      </ScrollElement>
      <ScrollElement
        viewport={{ once: true, amount: 0.5, margin: "0px 0px 0px 0px" }}
      >
        <CTASection />
      </ScrollElement>
      <ScrollElement
        viewport={{ once: true, amount: 0.5, margin: "0px 0px 0px 0px" }}
      >
        <Footer />
      </ScrollElement>
    </div>
  );
}
