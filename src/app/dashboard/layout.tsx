import React, { PropsWithChildren, Suspense } from "react";

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

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-[var(--header)] shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Suspense fallback={<BreadCrumbHeaderLoader />}>
            <BreadCrumbHeader />
          </Suspense>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
