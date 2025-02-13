import { asc, eq, getTableColumns } from "drizzle-orm";

import {
  author,
  courses,
  enrollments,
  videoProgress,
  videos,
} from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/trpc";

export const watchHistory = createTRPCRouter({
  lastAccessVideos: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db
      .select({
        ...getTableColumns(videos),
        author: {
          ...getTableColumns(author),
        },
        watchDuration: videoProgress.watchedDuration,
        totalDuration: videoProgress.totalDuration,
      })
      .from(enrollments)
      .where(eq(enrollments.userId, ctx.sessionRes.user.id))
      .orderBy(asc(enrollments.lastAccessedAt))
      .innerJoin(videos, eq(videos.id, enrollments.lastAccessedVideoId))
      .innerJoin(courses, eq(courses.id, enrollments.courseId))
      .innerJoin(author, eq(author.id, courses.authorId))
      .innerJoin(videoProgress, eq(videoProgress.videoId, videos.id));
    return res;
  }),
});
