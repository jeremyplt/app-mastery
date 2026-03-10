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

export default function HomeV4() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div
        className="grid grid-cols-[1fr_minmax(0,80rem)_1fr]"
        style={{ "--gutter": "2.5rem" } as React.CSSProperties}
      >
        {/* Left gutter */}
        <div
          className="border-r border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Center content — no nav links, zero distractions */}
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

        {/* Right gutter */}
        <div
          className="border-l border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>

      {/* Sticky mobile CTA */}
      <StickyCta />
    </div>
  );
}
