"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";

import { updatedLastWatchVideo } from "../action";
import { useVideoDetailsById } from "../api/use-video-details-by-id";
import { useVideoPlayer } from "../provider/video-player.provider";
import { GetVideoHistoryById } from "../types";

interface Props {
  videoId: string;
}

const VideoPlayer: React.FC<Props> = ({ videoId }) => {
  const playerRef = useRef<YouTubePlayer | undefined>(undefined);
  const setPlayer = useVideoPlayer((state) => state.setPlayer);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const isComponentMounting = useRef<boolean>(true);
  const isVideoCompleted = useRef<boolean>(false);

  // get the video details
  const { data: videoData } = useVideoDetailsById(videoId);

  // mutation to update the last watch video and progress
  const { mutate: updateWatchHistory } = useMutation({
    mutationFn: updatedLastWatchVideo,

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      if (res.data.updatedHistory.isCompleted && res.data.nextVideo) {
        if (res.data.nextVideo === "last-video") {
          toast.info("You have reached the last video in the course");
          return;
        }
        if (res.data.nextVideo === "rewatching") {
          toast.info("Please proceed to the next video");
          return;
        }

        toast.success("Video completed, redirecting to next video");
        // update the watch history in cache
        queryClient.setQueryData(
          [queryKeys.getWatchHistoryById, videoId],
          (oldData: GetVideoHistoryById) => ({
            ...oldData,
            isCompleted: true,
            watchedDuration:
              playerRef.current?.getCurrentTime() ?? oldData.watchedDuration,
          })
        );
        router.push(`${pathname}?v=${res.data.nextVideo}`);
      }
    },
  });

  // Track component mounting state
  useEffect(() => {
    isComponentMounting.current = false;
    return () => {
      isComponentMounting.current = true;
    };
  }, [videoId]);

  const onReady = useCallback(
    (event: { target: YouTubeProps["onReady"] }) => {
      playerRef.current = event.target;

      setPlayer(event.target);
    },
    [setPlayer]
  );

  const updateHistory = useCallback(() => {
    if (playerRef.current) {
      updateWatchHistory({
        videoId,
        videoProgress: Math.floor(playerRef.current?.getCurrentTime() || 0),
      });
    }
  }, [videoId]);

  // Update history on unmount, but only if not mounting and watched for min duration
  useEffect(() => {
    return () => {
      if (!isComponentMounting.current && !isVideoCompleted.current) {
        updateHistory();
      }
    };
  }, [isComponentMounting, updateHistory]);

  const handleOnEnd = useCallback(() => {
    if (playerRef.current) {
      isVideoCompleted.current = true;
      updateWatchHistory({
        videoId,
        videoProgress: Math.floor(playerRef.current?.getCurrentTime() || 0),
        shouldMarkAsComplete: true,
      });
    }
  }, [videoId]);

  return (
    <YouTube
      videoId={videoData.videoExist.youtube_video_id}
      id="video-player"
      onReady={onReady}
      loading="lazy"
      onPause={updateHistory}
      onEnd={handleOnEnd}
      className="sticky top-[var(--header)] z-40 aspect-video size-full overflow-hidden md:relative md:top-0 md:rounded-lg"
      opts={{
        width: "100%",
        height: "100%",
        playerVars: {
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          autoplay: 0,
          rel: 0,
          start: videoData.watchHistory?.isRewatching
            ? 0
            : videoData.watchHistory?.watchedDuration || 0,
        },
      }}
    />
  );
};

export default memo(VideoPlayer);
