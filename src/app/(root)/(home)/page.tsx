import SplashCursor from "@/components/shared/splash-cursor";
import HeroSection from "@/feature/home/components/hero-section";

const Page = async () => {
  return (
    <div>
      <HeroSection />
      <SplashCursor />
    </div>
  );
};

export default Page;
