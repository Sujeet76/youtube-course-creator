import { userRoute } from "@/feature/auth/server/user-route";
import { courseRoute } from "@/feature/create-course/server/course-route";
import { watchHistory } from "@/feature/dashboard/server/watch-history";
import { enrolledCourseRouter } from "@/feature/enrolled-course/server";
import { courseViewRouter } from "@/feature/video-view/server";

import { createCallerFactory, createTRPCRouter } from "../trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: userRoute,
  playlistToCourse: courseRoute,
  enrolledCourse: enrolledCourseRouter,
  courseView: courseViewRouter,
  watchHistory: watchHistory,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
