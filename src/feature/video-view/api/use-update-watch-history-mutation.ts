import { usePathname, useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";

import { updatedLastWatchVideo } from "../action";
import { GetVideoHistoryById } from "../types";

export const useUpdateWatchHistoryMutation = ({
  videoId,
}: {
  videoId: string;
  currentTimeStamp?: number;
}) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  return useMutation({
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
            isRewatching: res.data.updatedHistory.isRewatching,
            watchedDuration: res.data.updatedHistory.watchedDuration,
          })
        );
        router.push(`${pathname}?v=${res.data.nextVideo}`);
      }
    },
  });
};
