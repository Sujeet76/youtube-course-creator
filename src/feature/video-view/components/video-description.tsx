"use client";

import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Separator } from "@/components/ui/separator";
import { queryKeys } from "@/lib/query-keys";

import { GetVideoByIdSuccessResponse } from "../types";
import YouTubeDescription from "./description-renderer";

interface VideoDescriptionProps {
  videoId: string;
}
const VideoDescription: React.FC<VideoDescriptionProps> = ({ videoId }) => {
  const queryClient = useQueryClient();
  const videoDetails = queryClient.getQueryData<GetVideoByIdSuccessResponse>([
    queryKeys.viewVideo,
    videoId,
  ]);

  return (
    <div>
      <h2 className="text-lg font-semibold md:text-2xl">
        {videoDetails?.videoExist?.title}
      </h2>
      <Separator className="my-2 bg-foreground/10" />
      <div className="mt-2">
        <YouTubeDescription
          description={videoDetails?.videoExist?.description ?? ""}
        />
      </div>
    </div>
  );
};
export default VideoDescription;
