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
import { VideoPlayerStoreProvider } from "@/feature/video-view/provider/video-player.provider";
import { HydrateClient, api } from "@/trpc/server";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

const DashboardLayout: React.FC<Props> = async ({ children, params }) => {
  const resolvedPromise = await params;

  void api.courseView.getVideoList.prefetchInfinite(
    {
      courseId: resolvedPromise.id,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.totalPages > lastPage.currentPage
          ? lastPage.currentPage + 1
          : undefined,
    }
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <VideoPlayerStoreProvider>
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
        <HydrateClient>
          <RightSidebar params={resolvedPromise} />
        </HydrateClient>
      </VideoPlayerStoreProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
