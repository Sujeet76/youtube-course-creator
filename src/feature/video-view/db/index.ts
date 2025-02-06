import { and, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { enrollments, videos } from "@/drizzle/schema";
import { ApiError } from "@/lib/api-response";

export const getVideoByIdPrivate = async (id: string, userId: string) => {
  const [videoExist] = await db.select().from(videos).where(eq(videos.id, id));

  if (!videoExist) {
    throw new ApiError("NOT_FOUND", "Video not found");
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
    throw new ApiError("UNAUTHORIZED", "User is not enrolled in the course");
  }

  return videoExist;
};
