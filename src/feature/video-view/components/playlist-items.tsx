"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo } from "react";

import { formatDistanceToNow } from "date-fns";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";

import { useUpdateWatchHistory } from "../api/use-update-watch-history";

type Props = {
  video: {
    title: string;
    id: string;
    thumbnail: string | null;
    youtube_video_id: string;
    sequenceNumber: number;
    publishedAt: string;
  };
};

const PlayListItems = ({ video }: Props) => {
  const { inView, ref } = useInView({
    delay: 500,
    triggerOnce: true,
    threshold: 0.5,
  });
  const searchParams = useSearchParams();

  const watchHistoryQuery = useUpdateWatchHistory({
    videoId: video.id,
    enabled: inView,
  });

  return (
    <li
      ref={ref}
      className={cn(
        "group relative rounded-lg border shadow-sm",
        searchParams.get("v") === video.id &&
          "border-2 border-border bg-primary-20"
      )}
      id={video.id}
    >
      <Link
        href={{
          query: {
            v: video.id,
          },
        }}
        className={cn(
          "flex cursor-pointer items-center space-x-2 p-2 transition-shadow focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:ring-offset-1 focus-within:ring-offset-background hover:shadow-none"
        )}
      >
        <div className="relative aspect-video w-28 shrink-0 shadow-lg">
          <Image
            src={video.thumbnail ?? ""}
            alt={video.title}
            width={320}
            height={180}
            className="size-full rounded-lg object-cover"
          />
          {searchParams.get("v") === video.id && (
            <div
              aria-label="playing view current active video"
              className="absolute inset-0 grid place-content-center rounded-lg bg-primary-10/30 text-white"
            >
              <div
                aria-hidden
                className="flex h-6 w-9 items-end justify-center gap-0.5"
              >
                <div className="max-h-full w-full animate-loading-wave rounded-sm bg-blue-600/80 [animation-delay:0s]"></div>
                <div className="max-h-full w-full animate-loading-wave rounded-sm bg-blue-600/80 [animation-delay:0.5s]"></div>
                <div className="max-h-full w-full animate-loading-wave rounded-sm bg-blue-600/80 [animation-delay:.0.75s]"></div>
                <div className="max-h-full w-full animate-loading-wave rounded-sm bg-blue-600/80 [animation-delay:1s]"></div>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="line-clamp-2 text-sm font-semibold group-hover:underline group-hover:underline-offset-1">
            {video.title}
          </p>
          <time
            dateTime={video.publishedAt}
            className="mr-auto block text-end text-xs font-medium text-muted-foreground"
          >
            {formatDistanceToNow(video.publishedAt, {
              addSuffix: true,
            })}
          </time>
        </div>
      </Link>
      {watchHistoryQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        watchHistoryQuery.data && <div>History</div>
      )}
    </li>
  );
};

export default memo(PlayListItems);
