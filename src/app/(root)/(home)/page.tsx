import SplashCursor from "@/components/shared/splash-cursor";
import { DotPattern } from "@/components/ui/dot-pattern";
import CreateCourseForm from "@/feature/create-course/component/create-course-form";
import FAQSection from "@/feature/home/components/faq";
import HeroSection from "@/feature/home/components/hero-section";
import WhyToChooseUs from "@/feature/home/components/why-to-choose-us";

const Page = async () => {
  return (
    <div className="relative size-full">
      <DotPattern />
      <HeroSection />
      <WhyToChooseUs />
      <FAQSection />
      <SplashCursor />
      <CreateCourseForm showTrigger={false} />
    </div>
  );
};

export default Page;
