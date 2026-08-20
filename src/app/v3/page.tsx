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
import ThemeToggle from "@/components/ThemeToggle";

export default function HomeV3() {
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
    </div>
  );
}
