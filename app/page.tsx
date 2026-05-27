import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { GlobeSection } from "@/components/landing/globe-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { AboutSection } from "@/components/landing/about-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <GlobeSection />
      <FeaturesSection />
      <MetricsSection />
      <AboutSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
