"use client";

import React from "react";

import { useInfinitePlaylistItem } from "../api/use-infinite-playlist-item";
import PlayListItems from "./playlist-items";

interface Props {
  courseId: string;
}

const PlayList: React.FC<Props> = ({ courseId }) => {
  const infiniteQuery = useInfinitePlaylistItem(courseId);

  return (
    <ul className="hover-animation group space-y-2 px-1">
      {infiniteQuery.data.pages.map((page) =>
        page.playlist.map((video) => (
          <PlayListItems key={video.id} video={video} />
        ))
      )}
    </ul>
  );
};

export default PlayList;
