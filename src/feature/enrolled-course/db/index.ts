import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { enrollments } from "@/drizzle/schema";

export const getEnrolledCourses = async (userId: string) => {
  const res = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, userId),
    orderBy(fields, operators) {
      return [operators.desc(fields.lastAccessedAt)];
    },
    with: {
      course: {
        with: {
          author: true,
          videos: {
            columns: {
              id: true,
            },
          },
        },
      },
    },
  });

  return res.map((item) => ({
    ...item,
    course: {
      ...item.course,
      video_count: item.course.videos.length,
      videos: undefined,
    },
  }));
};
