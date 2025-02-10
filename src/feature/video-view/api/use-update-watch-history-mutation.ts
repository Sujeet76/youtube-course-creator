import { usePathname, useRouter } from "next/navigation";

// import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// import { GetVideoHistoryById } from "../types";
import { api } from "@/trpc/client";

export const useUpdateWatchHistoryMutation = ({
  videoId,
}: {
  videoId: string;
  currentTimeStamp?: number;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  return api.courseView.updateLastWatchedVideo.useMutation({
    onSuccess: (res) => {
      if (res.updatedHistory.isCompleted && res.nextVideo) {
        if (res.nextVideo === "last-video") {
          toast.info("You have reached the last video in the course");
          return;
        }
        if (res.nextVideo === "rewatching") {
          toast.info("Please proceed to the next video");
          return;
        }

        toast.success("Video completed, redirecting to next video");
        // update the watch history in cache
        api
          .useUtils()
          .courseView.getWatchHistoryById.setData({ videoId }, () => ({
            ...res.updatedHistory,
          }));

        router.push(`${pathname}?v=${res.nextVideo}`);
      }
    },
  });
};
