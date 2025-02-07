import { and, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import {
  CourseInsertionType,
  InsertAuthorType,
  VideoInsertType,
  author,
  courses,
  enrollments,
  videos,
} from "@/drizzle/schema";
import { ApiError } from "@/lib/api-response";

export const insertNewCourse = async (courseInfo: CourseInsertionType) => {
  // check if course already exist
  const [courseExist] = await db
    .select()
    .from(courses)
    .where(eq(courses.youtubePlaylistId, courseInfo.youtubePlaylistId));

  if (courseExist) throw new ApiError("VALIDATION", "Course already exists");

  const [createdCourse] = await db
    .insert(courses)
    .values(courseInfo)
    .returning();

  if (!createdCourse) {
    throw new ApiError("FATAL", "Could not create a course");
  }

  return createdCourse;
};

export const getAuthorById = async (channelId: string) => {
  const [authorExist] = await db
    .select()
    .from(author)
    .where(eq(author.youtubeChannelId, channelId));

  if (!authorExist) return null;

  return authorExist;
};

export const insetAuthor = async ({
  authorInfo,
  shouldCheckAuthor = true,
}: {
  authorInfo: InsertAuthorType;
  shouldCheckAuthor?: boolean;
}) => {
  try {
    if (shouldCheckAuthor) {
      const author = await getAuthorById(authorInfo.youtubeChannelId);
      if (author) {
        throw new ApiError("VALIDATION", "Author already exist");
      }
    } else throw new Error("Create New User");
  } catch {
    const [createdAuthor] = await db
      .insert(author)
      .values(authorInfo)
      .returning();
    if (!createdAuthor) {
      throw new ApiError("FATAL", "Error while inserting author");
    }
    return createdAuthor;
  }
};

export const insetVideos = async (videoInfo: Array<VideoInsertType>) => {
  const hasInserted = await db.insert(videos).values(videoInfo).execute();

  if (hasInserted.rowCount !== videoInfo.length) {
    throw new ApiError("FATAL", "Could not able to insert all videos");
  }

  return hasInserted;
};

export const enrollUserToCourse = async (courseId: string, userId: string) => {
  const [enrolled] = await db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.courseId, courseId), eq(enrollments.userId, userId))
    )
    .execute();

  if (enrolled)
    throw new ApiError("VALIDATION", "User already enrolled to this course");

  const [firstVideo] = await db
    .select({
      id: videos.id,
    })
    .from(videos)
    .where(eq(videos.courseId, courseId))
    .orderBy(videos.sequenceNumber)
    .limit(1)
    .execute();

  if (!firstVideo) {
    throw new ApiError("FATAL", "No video found for this course");
  }

  const [enrolledCourse] = await db
    .insert(enrollments)
    .values({
      courseId,
      userId,
      lastAccessedVideoId: firstVideo.id,
      lastAccessedAt: new Date(),
    })
    .returning();

  if (!enrolledCourse) {
    throw new ApiError("FATAL", "Could not enroll user to the course");
  }

  return enrolled;
};
