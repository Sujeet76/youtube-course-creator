import React, { Suspense } from "react";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { type SearchParams } from "nuqs";

import { Skeleton } from "@/components/ui/skeleton";
import { getVideoByIdQueryFn } from "@/feature/video-view/api/query-function";
import QueryClientErrorBoundary from "@/feature/video-view/components/query-client-error";
import VideoPlayer from "@/feature/video-view/components/video-player";
import { videoIdSearchParams } from "@/feature/video-view/validator";
import getQueryClient from "@/lib/get-query-client";

interface Props {
  searchParams: Promise<SearchParams>;
}

const EnrolledCourse: React.FC<Props> = async ({ searchParams }) => {
  const { v } = await videoIdSearchParams.parse(searchParams);
  if (!v) {
    // throw new Error("Video ID is required");
    return null;
  }

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(getVideoByIdQueryFn(v));

  return (
    <div className="container">
      <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
        <QueryClientErrorBoundary>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <VideoPlayer videoId={v} />
          </HydrationBoundary>
        </QueryClientErrorBoundary>
      </Suspense>
    </div>
  );
};

export default EnrolledCourse;
