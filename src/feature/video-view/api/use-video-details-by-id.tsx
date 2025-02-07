import { useSuspenseQuery } from "@tanstack/react-query";

import { getVideoByIdQueryFn } from "./query-function";

export const useVideoDetailsById = (id: string) => {
  return useSuspenseQuery(getVideoByIdQueryFn(id));
};
