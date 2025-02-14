"use client";

import SplashCursor from "@/components/shared/splash-cursor";
import { useIsMobile } from "@/hooks/use-mobile";

const CursorAnimation = () => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return <SplashCursor />;
};

export default CursorAnimation;
