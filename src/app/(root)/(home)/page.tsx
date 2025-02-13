import { DotPattern } from "@/components/magicui/dot-pattern";
import SplashCursor from "@/components/shared/splash-cursor";
import HeroSection from "@/feature/home/components/hero-section";

const Page = async () => {
  return (
    <div>
      <DotPattern />
      <HeroSection />
      <SplashCursor />
    </div>
  );
};

export default Page;
