"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import { toast } from "sonner";

import { updatedLastWatchVideo } from "../action";
import { useVideoDetailsById } from "../api/use-video-details-by-id";

interface Props {
  videoId: string;
}

const VideoPlayer: React.FC<Props> = ({ videoId }) => {
  const playerRef = useRef<YouTubePlayer | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();
  const [isComponentMounting, setIsComponentMounting] = useState(true);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

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
        router.push(`${pathname}?v=${res.data.nextVideo}`);
      }
    },
  });

  // Track component mounting state
  useEffect(() => {
    setIsComponentMounting(false);
    return () => {
      setIsComponentMounting(true);
    };
  }, [videoId]);

  const onReady = useCallback((event: { target: YouTubeProps["onReady"] }) => {
    playerRef.current = event.target;
  }, []);

  const updateHistory = useCallback(() => {
    if (playerRef.current) {
      updateWatchHistory({
        videoId,
        videoProgress: Math.floor(playerRef.current?.getCurrentTime() || 0),
      });
    }
  }, [updateWatchHistory, videoId]);

  // Update history on unmount, but only if not mounting and watched for min duration
  useEffect(() => {
    return () => {
      if (!isComponentMounting && !isVideoCompleted) {
        updateHistory();
      }
    };
  }, [isComponentMounting, updateHistory]);

  const handleOnEnd = useCallback(() => {
    if (playerRef.current) {
      setIsVideoCompleted(true);
      updateWatchHistory({
        videoId,
        videoProgress: Math.floor(playerRef.current?.getCurrentTime() || 0),
        shouldMarkAsComplete: true,
      });
    }
  }, [updateWatchHistory, videoId]);

  return (
    <YouTube
      videoId={videoData.videoExist.youtube_video_id}
      onReady={onReady}
      loading="lazy"
      onPlay={updateHistory}
      onPause={updateHistory}
      onEnd={handleOnEnd}
      className="h-[450px] w-full"
      opts={{
        width: "100%",
        height: "100%",
        playerVars: {
          showinfo: 1,
          iv_load_policy: 3,
          autoplay: 1,
          start: videoData.watchHistory?.isRewatching
            ? 0
            : videoData.watchHistory?.watchedDuration || 0,
        },
      }}
    />
  );
};

export default memo(VideoPlayer);
