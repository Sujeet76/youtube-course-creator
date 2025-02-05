import { useRef } from "react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCourseFromPlayList } from "../action";
import { ImportPlaylistSchemaType } from "../schema";

export default function useCreateCoursePlaylist() {
  const toastId = useRef<string | number | undefined>(undefined);

  return useMutation({
    mutationFn: async (data: ImportPlaylistSchemaType) => {
      const res = await createCourseFromPlayList(data);
      if (res.success) {
        return res.data;
      }

      throw new Error(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        id: toastId.current,
      });
    },
    onSuccess: () => {
      toast.success("Course created successfully", {
        id: toastId.current,
      });
    },
    onMutate: () => {
      toastId.current = toast.loading("Creating course...");
    },
  });
}
