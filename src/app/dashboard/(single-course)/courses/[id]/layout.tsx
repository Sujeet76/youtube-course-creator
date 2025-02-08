import React, { Suspense } from "react";

import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import BreadCrumbHeader, {
  BreadCrumbHeaderLoader,
} from "@/components/layout/sidebar/breadcrumb-header";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import RightSidebar from "@/feature/video-view/components/right-sidebar";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

const DashboardLayout: React.FC<Props> = ({ children, params }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-[var(--header)] shrink-0 items-center gap-2 rounded-t-lg bg-background px-4 md:sticky">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Suspense fallback={<BreadCrumbHeaderLoader />}>
            <BreadCrumbHeader />
          </Suspense>
        </header>
        {children}
      </SidebarInset>
      <Suspense fallback={<>loading</>}>
        <RightSidebar paramsPromise={params} />
      </Suspense>
    </SidebarProvider>
  );
};

export default DashboardLayout;
