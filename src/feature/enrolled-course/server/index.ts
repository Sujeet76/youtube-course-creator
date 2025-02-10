import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/trpc";

import { getEnrolledCourses } from "../db";

export const enrolledCourseRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await getEnrolledCourses({
        userId: ctx.sessionRes.user.id,
        page: input.page,
        limit: input.limit,
      });
    }),
});
