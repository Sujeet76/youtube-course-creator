import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { enrollments, videoProgress, videos } from "@/drizzle/schema";

export const getVideoByIdPrivate = async (id: string, userId: string) => {
  const [videoExist] = await db.select().from(videos).where(eq(videos.id, id));

  if (!videoExist) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Video not found",
    });
  }
  // check if user is enrolled in the course of not
  const [isEnrolled] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, videoExist.courseId) // check if user is enrolled in the course
      )
    );

  if (!isEnrolled) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not enrolled in the course",
    });
  }

  const watchHistory = await db.query.videoProgress.findFirst({
    where: and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, id)),
  });

  return { videoExist, enrolledDetails: isEnrolled, watchHistory };
};

export const getPlaylistPrivate = async ({
  courseId,
  userId,
  page = 1,
  limit = 20,
}: {
  courseId: string;
  userId: string;
  page?: number;
  limit?: number;
}) => {
  // check if user is enrolled in the course of not
  const [isEnrolled] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId) // check if user is enrolled in the course
      )
    );

  if (!isEnrolled) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not enrolled in the course",
    });
  }

  const [playlist, totalVideos] = await Promise.all([
    db.query.videos.findMany({
      where: eq(videos.courseId, isEnrolled.courseId),
      offset: Math.max(0, (page - 1) * limit),
      limit,
      orderBy: asc(videos.sequenceNumber),
      columns: {
        title: true,
        publishedAt: true,
        sequenceNumber: true,
        thumbnail: true,
        youtube_video_id: true,
        id: true,
      },
    }),
    db.$count(videos, eq(videos.courseId, isEnrolled.courseId)),
  ]);

  return {
    playlist,
    currentPage: page,
    totalPages: Math.ceil(totalVideos / limit),
  };
};

export const getWatchHistoryPerVideo = async ({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}) => {
  const [watchHistory] = await db
    .select()
    .from(videoProgress)
    .where(
      and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, videoId))
    );

  if (!watchHistory) {
    return null;
  }

  return watchHistory;
};

export const insertNewWatchHistory = async ({
  videoId,
  userId,
  courseId,
}: {
  videoId: string;
  userId: string;
  courseId: string;
}) => {
  const [[newHistory], [updatedEnrollment]] = await Promise.all([
    db
      .insert(videoProgress)
      .values({
        userId,
        videoId,
        lastWatchedAt: new Date(),
      })
      .returning(),
    db
      .update(enrollments)
      .set({
        lastAccessedVideoId: videoId,
        lastAccessedAt: new Date(),
      })
      .where(
        and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
      )
      .returning(),
  ]);

  if (!newHistory) {
    return null;
  }

  if (!updatedEnrollment) {
    return null;
  }

  return { newHistory, updatedEnrollment };
};

export const updatedWatchHistory = async (
  videoId: string,
  watchDuration: number,
  shouldMarkAsComplete: boolean = false,
  totalDuration: number,
  nextVideoIdx?: number,
  courseId?: string
) => {
  const [updatedHistory] = await db
    .update(videoProgress)
    .set({
      lastWatchedAt: new Date(),
      watchedDuration: watchDuration,
      isCompleted: shouldMarkAsComplete,
      isRewatching: shouldMarkAsComplete,
      totalDuration,
    })
    .where(eq(videoProgress.videoId, videoId))
    .returning();

  if (!updatedHistory) {
    return null;
  }

  if (shouldMarkAsComplete && nextVideoIdx && courseId) {
    const [nextVideo] = await db
      .select({
        id: videos.id,
      })
      .from(videos)
      .where(
        and(
          eq(videos.courseId, courseId),
          eq(videos.sequenceNumber, nextVideoIdx)
        )
      );
    if (!nextVideo) {
      return { updatedHistory, nextVideo: "last-video" };
    }

    return {
      updatedHistory,
      nextVideo: nextVideo.id,
    };
  }

  return { updatedHistory, nextVideo: null };
};
