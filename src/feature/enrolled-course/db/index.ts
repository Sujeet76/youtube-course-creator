import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { enrollments } from "@/drizzle/schema";

export const getEnrolledCourses = async ({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) => {
  const res = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, userId),
    orderBy(fields, operators) {
      return [operators.desc(fields.lastAccessedAt)];
    },
    limit: limit,
    offset: Math.max(0, (page - 1) * limit),
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
