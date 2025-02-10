import { TRPCError } from "@trpc/server";

import { VideoInsertType } from "@/drizzle/schema";
import { env } from "@/env/server";
import { extractPlaylistIdFromURL } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/trpc/trpc";
import {
  ChannelAuthorResponseType,
  PlaylistItemsResponseType,
  PlaylistResponseType,
  ThumbnailType,
} from "@/types/youtube.type";

import {
  enrollUserToCourse,
  getCourseByPlaylistId,
  insertAuthor,
  insertNewCourse,
  insertVideos,
} from "../db";
import { importPlaylistSchema } from "../schema";

export const courseRoute = createTRPCRouter({
  createCourseFromPlayList: protectedProcedure
    .input(importPlaylistSchema)
    .mutation(async ({ input, ctx }) => {
      // check if playlist already exist
      const playlistId = extractPlaylistIdFromURL(input.url);

      if (!playlistId) {
        throw new TRPCError({
          message: "Could not extract the playlist id",
          code: "BAD_REQUEST",
        });
      }

      // check if course already exist with the playlist id
      const courseExist = await getCourseByPlaylistId(playlistId);

      // course already exist therefor enroll the student into course
      if (courseExist) {
        const res = await enrollUserToCourse(
          courseExist.id,
          ctx.sessionRes.user.id
        );

        if (!res) {
          throw new TRPCError({
            message: "Failed to enroll user to course",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return res;
      }

      // handel the case when course does not exist
      // get initial info
      const [playlist, playlistItems] = await Promise.all([
        playlistFetcher(playlistId),
        playlistItemsFetcher(playlistId),
      ]);

      if ("error" in playlist) {
        throw new TRPCError({
          message: "Failed to fetch playlist",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (!playlist.items.length) {
        throw new TRPCError({
          message: "Playlist not found or does not contain any videos",
          code: "NOT_FOUND",
        });
      }

      if (!playlist.items[0]?.snippet) {
        throw new TRPCError({
          message: "Playlist info not found",
          code: "NOT_FOUND",
        });
      }

      if ("error" in playlistItems) {
        throw new TRPCError({
          message: "Failed to fetch playlist items",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (!playlistItems.items.length) {
        throw new TRPCError({
          message: "Playlist does not contain any videos",
          code: "NOT_FOUND",
        });
      }

      // get channel info
      const authorInfo = await channelInfoFetcher(
        playlist?.items[0]?.snippet.channelId ?? ""
      );

      if ("error" in authorInfo) {
        throw new TRPCError({
          message: "Failed to fetch channel info",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (!authorInfo?.items?.length) {
        throw new TRPCError({
          message: "Channel not found",
          code: "NOT_FOUND",
        });
      }

      if (!authorInfo.items[0]?.snippet) {
        throw new TRPCError({
          message: "Channel info not found",
          code: "NOT_FOUND",
        });
      }

      const info = authorInfo.items[0].snippet;
      // insert channel info into author table
      const newAuthor = await insertAuthor({
        authorInfo: {
          name: info.title,
          imgUrl: getVideoThumbnail(info.thumbnails)?.url ?? "",
          bio: info.description,
          subscriberCount: authorInfo.items[0].statistics.subscriberCount,
          youtubeChannelId: authorInfo.items[0].id,
          customUrl: `https://www.youtube.com/${info.customUrl}`,
        },
        shouldCheckAuthor: false,
      });

      if (!newAuthor) {
        throw new TRPCError({
          message: "Failed to save author details",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      // save the course info db
      const newCourse = await insertNewCourse({
        authorId: newAuthor.id,
        title: playlist.items[0].snippet.localized.title,
        description: playlist.items[0].snippet.localized.description,
        thumbnail: getVideoThumbnail(playlist.items[0].snippet.thumbnails)?.url,
        youtubePlaylistId: playlistId,
        creator: ctx.sessionRes.user.id,
      });

      // formate the initial playlist items
      let sequenceCounter = 1;
      const formattedPlaylistItems: Array<VideoInsertType> =
        playlistItems.items.map((item) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          courseId: newCourse.id,
          youtube_video_id: item.snippet.resourceId.videoId,
          sequenceNumber: sequenceCounter++,
          thumbnail: getVideoThumbnail(item.snippet.thumbnails)?.url,
          publishedAt: item.snippet.publishedAt,
        }));

      //hunt for the remaining videos
      let nextPageToken: string | undefined = playlistItems.nextPageToken;
      while (nextPageToken) {
        const playlistItemsNext = await playlistItemsFetcher(
          playlistId,
          nextPageToken
        );

        if ("error" in playlistItemsNext) {
          throw new TRPCError({
            message: "Failed to fetch playlist items",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        nextPageToken = playlistItemsNext?.nextPageToken;

        const subList = playlistItemsNext.items.map((item) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          courseId: newCourse.id,
          youtube_video_id: item.snippet.resourceId.videoId,
          sequenceNumber: sequenceCounter++,
          thumbnail: getVideoThumbnail(item.snippet.thumbnails)?.url,
          publishedAt: item.snippet.publishedAt,
        }));

        formattedPlaylistItems.push(...subList);
      }

      // insert the formatted playlist items into the db
      const videos = await insertVideos(formattedPlaylistItems);

      if (videos.length !== formattedPlaylistItems.length) {
        throw new TRPCError({
          message: "Failed to save videos",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      // enroll the user to the course
      const newEnrollment = await enrollUserToCourse(
        newCourse.id,
        ctx.sessionRes.user.id
      );

      if (!newEnrollment) {
        throw new TRPCError({
          message: "Failed to enroll user to course",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return newEnrollment;
    }),
});

const playlistURLConstructor = (playlistId: string) => {
  return `https://www.googleapis.com/youtube/v3/playlists?key=${env.YOUTUBE_API_KEY}&part=snippet&fields=items/snippet(localized,channelTitle,publishedAt,thumbnails,channelId)&id=${playlistId}`;
};

const playlistItemsURLConstructor = (
  playlistId: string,
  nextToken?: string
) => {
  if (nextToken) {
    return `https://www.googleapis.com/youtube/v3/playlistItems?key=${env.YOUTUBE_API_KEY}&part=snippet&fields=items(snippet(title,publishedAt,description,thumbnails,resourceId(videoId))),nextPageToken&playlistId=${playlistId}&maxResults=50&pageToken=${nextToken}`;
  }

  return `https://www.googleapis.com/youtube/v3/playlistItems?key=${env.YOUTUBE_API_KEY}&part=snippet&fields=items(snippet(title,publishedAt,description,thumbnails,resourceId(videoId))),nextPageToken&playlistId=${playlistId}&maxResults=50`;
};

const channelInfoURLConstructor = (channelId: string) => {
  return `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&fields=items(id,snippet(title,publishedAt,description,thumbnails,customUrl),statistics(subscriberCount))&id=${channelId}&key=${env.YOUTUBE_API_KEY}`;
};

const playlistFetcher = async (
  playlistId: string
): Promise<PlaylistResponseType> => {
  return await fetch(playlistURLConstructor(playlistId), {
    method: "GET",
  }).then((res) => res.json());
};

const playlistItemsFetcher = async (
  playlistId: string,
  nextToken?: string
): Promise<PlaylistItemsResponseType> => {
  return await fetch(playlistItemsURLConstructor(playlistId, nextToken), {
    method: "GET",
  }).then((res) => res.json());
};

export const channelInfoFetcher = async (
  channelId: string
): Promise<ChannelAuthorResponseType> => {
  return await fetch(channelInfoURLConstructor(channelId), {
    method: "GET",
  }).then((res) => res.json());
};

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
