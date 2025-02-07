import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const videoIdSearchParams = createSearchParamsCache({
  v: parseAsString,
});
// export const loadVideoIdSearchParams = createLoader(videoIdSearchParams);
export type VideoIdSearchParamsT = ReturnType<typeof videoIdSearchParams.parse>;
