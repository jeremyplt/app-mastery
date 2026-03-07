import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import PainPoints from "@/components/PainPoints";
import Solution from "@/components/Solution";
import ForWho from "@/components/ForWho";
import Program from "@/components/Program";
import TechStack from "@/components/TechStack";
import Transformation from "@/components/Transformation";
import Testimonials from "@/components/Testimonials";
import Instructor from "@/components/Instructor";
import Bonuses from "@/components/Bonuses";
import Pricing from "@/components/Pricing";
import RoiJustification from "@/components/RoiJustification";
import Guarantee from "@/components/Guarantee";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative" style={{ background: "#050508", minHeight: "100vh" }}>
      <div className="dot-pattern" />
      <div className="grid-pattern" />

      <main>
        <Hero />
        <SocialProofBar />
        <PainPoints />
        <Solution />
        <ForWho />
        <Program />
        <TechStack />
        <Transformation />
        <Testimonials id="testimonials-1" />
        <Instructor />
        <Bonuses />
        <Pricing />
        <RoiJustification />
        <Guarantee />
        <Testimonials id="testimonials-2" />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
