import { ApiError, ApiResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/async-handler";
import { getYoutubePlaylistId } from "@/lib/utils";

import { ImportPlaylistSchemaType, importPlaylistSchema } from "../schema";

export const createCourseFromPlayList = asyncHandler(
  async (data: ImportPlaylistSchemaType) => {
    const isValidData = importPlaylistSchema.parse(data);

    const playlistId = getYoutubePlaylistId(isValidData.url);

    if (!playlistId) {
      throw new ApiError("VALIDATION", "Could not extract the playlist id");
    }

    // fetch the playlist details
    // const playlistDetails = await Promise.all([
    //   // fetch the playlist details
    //   // fetch()
    //   // fetch the playlist items
    // ]);

    return ApiResponse.Ok({
      message: "Playlist imported successfully",
      data: playlistId,
    });
  }
);
