import HeroV4 from "@/components/v4/HeroV4";
import HeroVideoV4 from "@/components/v4/HeroVideoV4";
import TimelineV4 from "@/components/v4/TimelineV4";
import PainPointsV4 from "@/components/v4/PainPointsV4";
import AgitationV4 from "@/components/v4/AgitationV4";
import SolutionV4 from "@/components/v4/SolutionV4";
import TransformationV4 from "@/components/v4/TransformationV4";
import InstructorV4 from "@/components/v4/InstructorV4";
import ProofRevenueV4 from "@/components/v4/ProofRevenueV4";
import ProgramV4 from "@/components/v4/ProgramV4";
import ProofContentV4 from "@/components/v4/ProofContentV4";
import ProofInfluencerV4 from "@/components/v4/ProofInfluencerV4";
import TestimonialsV4 from "@/components/v4/TestimonialsV4";
import BonusesV4 from "@/components/v4/BonusesV4";
import PricingV4 from "@/components/v4/PricingV4";
import GuaranteeV4 from "@/components/v4/GuaranteeV4";
import FaqV4 from "@/components/v4/FaqV4";
import FinalCtaV4 from "@/components/v4/FinalCtaV4";
import FooterV4 from "@/components/v4/FooterV4";
import StickyCtaV4 from "@/components/v4/StickyCtaV4";
import WhoIsThisForV4 from "@/components/v4/WhoIsThisForV4";
import WhyDifferentV4 from "@/components/v4/WhyDifferentV4";

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
          <HeroV4 />
          <HeroVideoV4 />
          <PainPointsV4 />
          <AgitationV4 />
          <InstructorV4 />
          <SolutionV4 />
          <TimelineV4 />
          <ProofRevenueV4 />
          <TransformationV4 />
          <ProofContentV4 />
          <ProofInfluencerV4 />
          <WhoIsThisForV4 />
          <TestimonialsV4 />
          <WhyDifferentV4 />
          <ProgramV4 />
          <BonusesV4 />
          <PricingV4 />
          <GuaranteeV4 />
          <FaqV4 />
          <FinalCtaV4 />
          <FooterV4 />
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
      <StickyCtaV4 />
    </div>
  );
}
