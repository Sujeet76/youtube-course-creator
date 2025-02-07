import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import { getPlaylistVideoList, getVideoById } from "../action";

export const getVideoByIdQueryFn = (videoId: string) =>
  queryOptions({
    queryKey: [queryKeys.viewVideo, videoId],
    queryFn: async ({ queryKey }) => {
      const v = queryKey[1];
      const res = await getVideoById(v);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
  });

export const getPlaylistVideoLIstInfiniteQueryFn = (courseId: string) =>
  queryOptions({
    queryKey: [queryKeys.getPlaylistVideoList, courseId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getPlaylistVideoList({
        courseId,
        page: pageParam as number,
        limit: 20,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
  });
