import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import { getWatchHistoryById } from "../action";

export const useUpdateWatchHistory = ({
  videoId,
  enabled,
}: {
  videoId: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.getWatchHistoryById, videoId],
    queryFn: async () => {
      const res = await getWatchHistoryById(videoId);

      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    enabled: enabled,
  });
};
