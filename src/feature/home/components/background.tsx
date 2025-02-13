"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import Aurora from "@/components/shared/aura-background";
import { useIsMobile } from "@/hooks/use-mobile";

export const Background = () => {
  const [colorStops, setColorStops] = useState<[string, string, string]>([
    "#2cd8d55c",
    "#6b8dd65c",
    "#8f37d75c",
  ]);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log({ resolvedTheme });
    if (resolvedTheme === "dark")
      setColorStops(["#2cd8d55c", "#6b8dd65c", "#8f37d75c"]);
    else setColorStops(["#5D9FFF", "#B8DCFF", "#6BBBFF"]);
  }, [resolvedTheme]);

  if (isMobile) return null;

  return <Aurora colorStops={colorStops} speed={0.5} amplitude={1} />;
};
