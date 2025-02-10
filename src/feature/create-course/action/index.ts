"use server";

import { headers } from "next/headers";

import { VideoInsertType } from "@/drizzle/schema";
import { env } from "@/env/server";
import { ApiError, ApiResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/async-handler";
import { auth } from "@/lib/auth";
import { getYoutubePlaylistId } from "@/lib/utils";
import {
  ChannelAuthorResponseType,
  PlaylistItemsResponseType,
  PlaylistResponseType,
  ThumbnailType,
} from "@/types/youtube.type";

import {
  enrollUserToCourse,
  getAuthorById,
  insertNewCourse,
  insetAuthor,
  insetVideos,
} from "../db";
import { ImportPlaylistSchemaType, importPlaylistSchema } from "../schema";

// get the videoImage from the youtube res
const getVideoThumbnail = (data: ThumbnailType) => {
  if (data?.maxres) {
    return data.maxres;
  }
  if (data.standard) {
    return data.standard;
  }
  if (data.high) {
    return data.high;
  }
  if (data.medium) {
    return data.medium;
  }
  if (data.default) {
    return data.default;
  }
  return null;
};

export const createCourseFromPlayList = asyncHandler(
  async (data: ImportPlaylistSchemaType) => {
    const isValidData = importPlaylistSchema.parse(data);

    const playlistId = getYoutubePlaylistId(isValidData.url);

    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user?.user) {
      throw new ApiError("AUTH", "User not authenticated");
    }

    if (!playlistId) {
      throw new ApiError("VALIDATION", "Could not extract the playlist id");
    }

    const [playlist, playlistItems] = await Promise.all([
      fetch(
        `https://www.googleapis.com/youtube/v3/playlists?key=${env.YOUTUBE_API_KEY}&part=snippet&fields=items/snippet(localized,channelTitle,publishedAt,thumbnails,channelId)&id=${playlistId}`,
        {
          method: "GET",
        }
      ).then((res) => res.json()) as Promise<PlaylistResponseType>,
      fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${env.YOUTUBE_API_KEY}&part=snippet&fields=items(snippet(title,publishedAt,description,thumbnails,resourceId(videoId))),nextPageToken&playlistId=${playlistId}&maxResults=50`,
        {
          method: "GET",
        }
      ).then((res) => res.json()) as Promise<PlaylistItemsResponseType>,
    ]);

    if ("error" in playlist) {
      throw new ApiError(
        "API_ERROR",
        playlist.error.message ?? "Unknown error"
      );
    }

    if (!playlist.items.length) {
      throw new ApiError("API_ERROR", "Playlist not found");
    }

    let authorExist = await getAuthorById(playlist.items[0].snippet.channelId);

    if (!authorExist) {
      // get channel info
      const res: ChannelAuthorResponseType = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&fields=items(id,snippet(title,publishedAt,description,thumbnails,customUrl),statistics(subscriberCount))&id=${playlist.items[0].snippet.channelId}&key=${env.YOUTUBE_API_KEY}`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      if ("error" in res) {
        throw new ApiError("API_ERROR", res.error.message ?? "Unknown error");
      }

      if (!res?.items?.length) {
        throw new ApiError("API_ERROR", "Channel not found");
      }
      const info = res.items[0].snippet;
      authorExist =
        (await insetAuthor({
          authorInfo: {
            name: info.title,
            imgUrl: getVideoThumbnail(info.thumbnails)?.url ?? "",
            bio: info.description,
            subscriberCount: res.items[0].statistics.subscriberCount,
            youtubeChannelId: res.items[0].id,
            customUrl: `https://www.youtube.com/${info.customUrl}`,
          },
          shouldCheckAuthor: false,
        })) || null;

      if (!authorExist) {
        throw new ApiError("API_ERROR", "Could not save author details");
      }
    }

    // save the playlist details to the database
    const newCourse = await insertNewCourse({
      authorId: authorExist.id,
      title: playlist.items[0].snippet.localized.title,
      description: playlist.items[0].snippet.localized.description,
      thumbnail: getVideoThumbnail(playlist.items[0].snippet.thumbnails)?.url,
      youtubePlaylistId: playlistId,
      creator: user.user.id,
    });

    if ("error" in playlistItems) {
      throw new ApiError(
        "API_ERROR",
        playlistItems.error.message ?? "Unknown error"
      );
    }

    if (!playlistItems.items.length) {
      throw new ApiError("API_ERROR", "Playlist not found");
    }

    let Idx = 0;
    const formattedPlaylistItems: Array<VideoInsertType> =
      playlistItems.items.map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        courseId: newCourse.id,
        youtube_video_id: item.snippet.resourceId.videoId,
        sequenceNumber: Idx++,
        thumbnail: getVideoThumbnail(item.snippet.thumbnails)?.url,
        publishedAt: item.snippet.publishedAt,
      }));

    let nextToken: string | null | undefined = playlistItems.nextPageToken;
    while (nextToken) {
      const playlistItemsNext: PlaylistItemsResponseType = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${env.YOUTUBE_API_KEY}&part=snippet&fields=items(snippet(title,publishedAt,description,thumbnails,resourceId(videoId))),nextPageToken&playlistId=${playlistId}&maxResults=50&pageToken=${nextToken}`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      if ("error" in playlistItemsNext) {
        throw new ApiError(
          "API_ERROR",
          playlistItemsNext.error.message ?? "Unknown error"
        );
      }

      nextToken = playlistItemsNext?.nextPageToken;

      const subList = playlistItemsNext.items.map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        courseId: newCourse.id,
        youtube_video_id: item.snippet.resourceId.videoId,
        sequenceNumber: Idx++,
        thumbnail: getVideoThumbnail(item.snippet.thumbnails)?.url,
        publishedAt: item.snippet.publishedAt,
      }));
      formattedPlaylistItems.push(...subList);
    }

    await insetVideos(formattedPlaylistItems);

    await enrollUserToCourse(newCourse.id, user.user.id);

    return ApiResponse.Ok({
      message:
        "Playlist imported successfully and successfully enrolled you, Redirecting...",
      data: {},
    });
  }
);
