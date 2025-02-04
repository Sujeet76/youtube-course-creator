"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const ThemeToggler = dynamic(
  () => import("@/components/shared/theme-toggler"),
  {
    ssr: false,
    loading: () => <Skeleton className="size-8 rounded-full" />,
  }
);

const DynamicThemeToggler = () => {
  return <ThemeToggler />;
};

export default DynamicThemeToggler;
