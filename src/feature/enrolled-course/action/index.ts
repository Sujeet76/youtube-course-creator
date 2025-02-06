import { headers } from "next/headers";

import { ApiError, ApiResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/async-handler";
import { auth } from "@/lib/auth";

import { getEnrolledCourses as getEnrolledCoursesDB } from "../db";

export const getEnrolledCourses = asyncHandler(async () => {
  // get all enrolled courses
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user?.user) {
    throw new ApiError("AUTH", "User not authenticated");
  }

  // get all enrolled courses
  const courses = await getEnrolledCoursesDB(user.user.id);

  return ApiResponse.Ok({
    message: "Enrolled courses fetched successfully",
    data: courses || [],
  });
});
