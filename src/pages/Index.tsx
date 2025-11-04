import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { Hero } from "@/features/landing/components/Hero";
import { Stats } from "@/features/landing/components/Stats";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { Results } from "@/features/landing/components/Results";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { CTA } from "@/features/landing/components/CTA";
import { MarketingFooter } from "@/features/landing/components/MarketingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <LandingHeader />
      <Hero />
      <Stats />
      <Testimonials />
      <Features />
      <HowItWorks />
      <Results />
      <CTA />
      <MarketingFooter />
    </div>
  );
};

export default Index;
