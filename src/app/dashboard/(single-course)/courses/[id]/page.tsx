import React, { Suspense } from "react";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { type SearchParams } from "nuqs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVideoByIdQueryFn } from "@/feature/video-view/api/query-function";
import { EnrolledCourseSkeleton } from "@/feature/video-view/components/loader";
import QueryClientErrorBoundary from "@/feature/video-view/components/query-client-error";
import VideoDescription from "@/feature/video-view/components/video-description";
import VideoPlayer from "@/feature/video-view/components/video-player";
import { loadVideoIdSearchParams } from "@/feature/video-view/validator";
import getQueryClient from "@/lib/get-query-client";

interface Props {
  searchParams: Promise<SearchParams>;
}

const EnrolledCourse: React.FC<Props> = async ({ searchParams }) => {
  const { v } = await loadVideoIdSearchParams(searchParams);
  if (!v) {
    return null;
  }

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(getVideoByIdQueryFn(v));

  return (
    <div className="pb-6 md:container">
      <div>
        <Suspense key={v} fallback={<EnrolledCourseSkeleton />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <QueryClientErrorBoundary>
              <VideoPlayer videoId={v} />
            </QueryClientErrorBoundary>
            <div className="relative mt-2 px-4 md:px-0">
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="h-full rounded-lg bg-primary-80 p-3 md:p-5"
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
  );
};

export default EnrolledCourse;
