import React, { Suspense } from "react";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { type SearchParams } from "nuqs";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVideoByIdQueryFn } from "@/feature/video-view/api/query-function";
import QueryClientErrorBoundary from "@/feature/video-view/components/query-client-error";
import VideoDescription from "@/feature/video-view/components/video-description";
import VideoPlayer from "@/feature/video-view/components/video-player";
import { VideoPlayerStoreProvider } from "@/feature/video-view/provider/video-player.provider";
import { videoIdSearchParams } from "@/feature/video-view/validator";
import getQueryClient from "@/lib/get-query-client";

interface Props {
  searchParams: Promise<SearchParams>;
}

const EnrolledCourse: React.FC<Props> = async ({ searchParams }) => {
  const { v } = await videoIdSearchParams.parse(searchParams);
  if (!v) {
    return null;
  }

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(getVideoByIdQueryFn(v));

  return (
    <VideoPlayerStoreProvider>
      <div className="container pb-6">
        <div>
          <Suspense
            key={v}
            fallback={<Skeleton className="h-[450px] w-full" />}
          >
            <QueryClientErrorBoundary>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <VideoPlayer videoId={v} />
                <div className="mt-2">
                  <Tabs defaultValue="description">
                    <TabsList>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      className="h-full rounded-lg bg-primary-80 p-3"
                      value="description"
                    >
                      <VideoDescription videoId={v} />
                    </TabsContent>
                    <TabsContent value="notes">
                      Change your password here.
                    </TabsContent>
                  </Tabs>
                </div>
              </HydrationBoundary>
            </QueryClientErrorBoundary>
          </Suspense>
        </div>
      </div>
    </VideoPlayerStoreProvider>
  );
};

export default EnrolledCourse;
