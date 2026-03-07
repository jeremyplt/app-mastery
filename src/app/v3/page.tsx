import HeroV3 from "@/components/v3/HeroV3";
import PainPointsV3 from "@/components/v3/PainPointsV3";
import SolutionV3 from "@/components/v3/SolutionV3";
import ForWhoV3 from "@/components/v3/ForWhoV3";
import ProgramV3 from "@/components/v3/ProgramV3";
import TechStackV3 from "@/components/v3/TechStackV3";
import TransformationV3 from "@/components/v3/TransformationV3";
import TestimonialsV3 from "@/components/v3/TestimonialsV3";
import InstructorV3 from "@/components/v3/InstructorV3";
import BonusesV3 from "@/components/v3/BonusesV3";
import PricingV3 from "@/components/v3/PricingV3";
import FaqV3 from "@/components/v3/FaqV3";
import FinalCtaV3 from "@/components/v3/FinalCtaV3";
import FooterV3 from "@/components/v3/FooterV3";

export default function HomeV3() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      {/* Main grid with gutter pattern columns like tailwindcss.com */}
      <div
        className="grid grid-cols-[1fr_minmax(0,80rem)_1fr]"
        style={{ "--gutter": "2.5rem" } as React.CSSProperties}
      >
        {/* Left gutter with diagonal pattern */}
        <div
          className="border-r border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Center content */}
        <div className="min-w-0">
          <HeroV3 />
          <PainPointsV3 />
          <SolutionV3 />
          <ForWhoV3 />
          <ProgramV3 />
          <TechStackV3 />
          <TransformationV3 />
          <TestimonialsV3 />
          <InstructorV3 />
          <BonusesV3 />
          <PricingV3 />
          <FaqV3 />
          <FinalCtaV3 />
          <FooterV3 />
        </div>

        {/* Right gutter with diagonal pattern */}
        <div
          className="border-l border-white/10 bg-fixed"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>
    </div>
  );
}
