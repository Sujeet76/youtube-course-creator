import { DotPattern } from "@/components/magicui/dot-pattern";
import SplashCursor from "@/components/shared/splash-cursor";
import CreateCourseForm from "@/feature/create-course/component/create-course-form";
import HeroSection from "@/feature/home/components/hero-section";

const Page = async () => {
  return (
    <div className="relative size-full">
      <DotPattern />
      <HeroSection />
      <SplashCursor />
      <CreateCourseForm showTrigger={false} />
    </div>
  );
};

export default Page;
