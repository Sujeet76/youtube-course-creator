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
          <Suspense key={v} fallback={<EnrolledCourseSkeleton />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <QueryClientErrorBoundary>
                <VideoPlayer videoId={v} />
              </QueryClientErrorBoundary>
              <div className="mt-2">
                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    className="h-full rounded-lg bg-primary-80 p-5"
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
          </Suspense>
        </div>
      </div>
    </VideoPlayerStoreProvider>
  );
};

const EnrolledCourseSkeleton: React.FC = () => {
  return (
    <div>
      <Skeleton className="aspect-video min-h-[450px] w-full rounded-lg" />

      <div className="mt-2">
        <div className="flex gap-2 border-b pb-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="mt-2 rounded-lg bg-primary-80 p-5">
          <Skeleton className="mb-4 h-8 w-3/4" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourse;
