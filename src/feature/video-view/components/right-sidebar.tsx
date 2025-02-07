import React, { ComponentProps, Suspense } from "react";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import getQueryClient from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";

import { getPlaylistVideoList } from "../action";
import PlayList from "./play-list";

interface Props extends ComponentProps<typeof Sidebar> {
  paramsPromise: Promise<{
    id: string;
  }>;
}

const RightSidebar: React.FC<Props> = async ({ paramsPromise, ...props }) => {
  const queryClient = getQueryClient();
  const { id } = await paramsPromise;

  queryClient.prefetchInfiniteQuery({
    queryKey: [queryKeys.getPlaylistVideoList, id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getPlaylistVideoList({
        courseId: id,
        page: pageParam,
        limit: 20,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
    initialPageParam: 1,
  });

  return (
    <Suspense fallback={<>loading</>}>
      <Sidebar
        collapsible="none"
        className="sticky top-0 hidden h-svh lg:flex"
        variant="floating"
        {...props}
      >
        <SidebarHeader className="h-16 border-b border-sidebar-border"></SidebarHeader>
        <SidebarContent>
          <Suspense fallback={<ListLoadingSkeleton />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <PlayList courseId={id} />
            </HydrationBoundary>
          </Suspense>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Plus />
                <span>New Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </Suspense>
  );
};

const ListLoadingSkeleton = () => {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <li
          className="flex items-center space-x-2 rounded-lg border p-2 shadow-md"
          key={index}
        >
          <Skeleton className="relative aspect-video size-full w-28 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="ml-auto h-3 w-20" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RightSidebar;
