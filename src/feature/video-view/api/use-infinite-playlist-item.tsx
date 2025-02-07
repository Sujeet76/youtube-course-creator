import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import { getPlaylistVideoList } from "../action";

export const useInfinitePlaylistItem = (courseId: string) => {
  return useSuspenseInfiniteQuery({
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
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};
