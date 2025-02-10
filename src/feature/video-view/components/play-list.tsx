"use client";

import { forwardRef } from "react";

import InfiniteLoading from "@/components/shared/infinite-loading";
import { cn } from "@/lib/utils";

import { useInfinitePlaylistItem } from "../api/use-infinite-playlist-item";
import PlayListItems from "./playlist-items";

interface Props {
  courseId: string;
  className?: string;
}

const PlayList = forwardRef<HTMLUListElement, Props>(
  ({ courseId, className }, ref) => {
    const infiniteQuery = useInfinitePlaylistItem(courseId);

    return (
      <ul
        ref={ref}
        className={cn(
          "hover-animation w-full space-y-2 overflow-x-auto px-1",
          className
        )}
      >
        {infiniteQuery.data.pages.map((page) =>
          page.playlist.map((video) => (
            <PlayListItems key={video.id} video={video} />
          ))
        )}

        <InfiniteLoading
          isFetchingNextPage={infiniteQuery.isFetchingNextPage}
          hasNextPage={infiniteQuery.hasNextPage}
          fetchNextPage={infiniteQuery.fetchNextPage}
        />
      </ul>
    );
  }
);

PlayList.displayName = "PlayList";

export default PlayList;
