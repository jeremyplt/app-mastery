import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";
import Timeline from "@/components/Timeline";
import PainPoints from "@/components/PainPoints";
import Agitation from "@/components/Agitation";
import Solution from "@/components/Solution";
import Transformation from "@/components/Transformation";
import Instructor from "@/components/Instructor";
import ProofRevenue from "@/components/ProofRevenue";
import Program from "@/components/Program";
import ProofContent from "@/components/ProofContent";
import ProofInfluencer from "@/components/ProofInfluencer";
import ProofViral from "@/components/ProofViral";
import Testimonials from "@/components/Testimonials";
import Bonuses from "@/components/Bonuses";
import Urgency from "@/components/Urgency";
import Pricing from "@/components/Pricing";
import Guarantee from "@/components/Guarantee";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import WhyDifferent from "@/components/WhyDifferent";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomeV4() {
  return (
    <div className="min-h-screen text-[var(--fg)] antialiased">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 30% at 50% -4%, var(--accent-glow), transparent 60%)",
        }}
      />

      {/* Global theme toggle */}
      <div className="fixed bottom-4 right-4 z-[60]">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-[80rem] min-w-0">
        {/* Center content, no nav links, zero distractions */}
        <div className="min-w-0">
          <Hero />
          <HeroVideo />
          <PainPoints />
          <Agitation />
          <Instructor />
          <Solution />
          <Timeline />
          <ProofRevenue />
          <Transformation />
          <ProofContent />
          <ProofInfluencer />
          <ProofViral />
          <WhoIsThisFor />
          {/* <Testimonials /> */}
          <WhyDifferent />
          <Program />
          <Bonuses />
          <Urgency />
          <Pricing />
          <Guarantee />
          <Faq />
          <FinalCta />
          <Footer />
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <StickyCta />
    </div>
  );
}
