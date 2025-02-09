"use server";

import { headers } from "next/headers";

import { ApiError, ApiResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/async-handler";
import { auth, getSession } from "@/lib/auth";

import {
  getPlaylistPrivate,
  getVideoByIdPrivate,
  getWatchHistoryPerVideo,
  insertNewWatchHistory,
  updatedWatchHistory,
} from "../db";

export const getVideoById = asyncHandler(async (id: string) => {
  // check if user is logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new ApiError(
      "UNAUTHORIZED",
      "You need to be logged in to view this content"
    );
  }

  // fetch video from db
  const videoDetail = await getVideoByIdPrivate(id, session.user.id);

  return ApiResponse.Ok({
    data: videoDetail,
    message: "Video fetched successfully",
  });
});

export const getPlaylistVideoList = asyncHandler(
  async ({
    courseId,
    page,
    limit,
  }: {
    courseId: string;
    page: number;
    limit: number;
  }) => {
    // check if user is logged in
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new ApiError(
        "UNAUTHORIZED",
        "You need to be logged in to view this content"
      );
    }

    // fetch video from db
    const videoDetail = await getPlaylistPrivate({
      courseId,
      userId: session.user.id,
      page,
      limit,
    });

    return ApiResponse.Ok({
      data: videoDetail,
      message: "Video fetched successfully",
    });
  }
);

export const getWatchHistoryById = asyncHandler(async (id: string) => {
  // check if user is logged in
  const session = await getSession();
  if (!session?.user) {
    throw new ApiError(
      "UNAUTHORIZED",
      "You need to be logged in to view this content"
    );
  }

  // fetch watch history from db
  const watchHistory = await getWatchHistoryPerVideo({
    videoId: id,
    userId: session.user.id,
  });

  return ApiResponse.Ok({
    data: watchHistory,
    message: "Watch history fetched successfully",
  });
});

export const updatedLastWatchVideo = asyncHandler(
  async ({
    videoId,
    videoProgress,
    shouldMarkAsComplete = false,
    totalDuration,
  }: {
    videoId: string;
    videoProgress: number;
    shouldMarkAsComplete?: boolean;
    totalDuration: number;
  }) => {
    // check if user is logged in
    const session = await getSession();

    if (!session?.user) {
      throw new ApiError(
        "UNAUTHORIZED",
        "You need to be logged in to view this content"
      );
    }

    // check is enrolled and video exists
    const { videoExist, watchHistory } = await getVideoByIdPrivate(
      videoId,
      session.user.id
    );

    if (!videoExist) {
      throw new ApiError("NOT_FOUND", "Video not found");
    }

    if (!watchHistory) {
      // if no watch history exists, create new one
      const result = await insertNewWatchHistory({
        videoId,
        courseId: videoExist.courseId,
        userId: session.user.id,
      });

      if (!result?.newHistory) {
        throw new ApiError("UNKNOWN", "Could not create watch history");
      }

      return ApiResponse.Ok({
        message: "Watch history created successfully",
        data: {
          updatedHistory: result.newHistory,
          nextVideo: null,
        },
      });
    }

    // if watch history exists, update it
    const res = await updatedWatchHistory(
      videoId,
      videoProgress,
      shouldMarkAsComplete,
      totalDuration,
      videoExist.sequenceNumber + 1,
      videoExist.courseId
    );

    if (!res) {
      throw new ApiError("UNKNOWN", "Could not update watch history");
    }

    return ApiResponse.Ok({
      message: "Watch history updated successfully",
      data: res,
    });
  }
);
