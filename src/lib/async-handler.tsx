import { ZodError } from "zod";

import {
  ApiError,
  ApiResponse,
  ApiResult,
  SuccessResponse,
} from "./api-response";

/**
 * A generic async handler that provides consistent error handling and response formatting
 *
 * @template T - The return type of the async function
 * @template A - The arguments type of the async function
 *
 * @param asyncFn - The async function to be wrapped
 * @returns A function that handles the async operation with standardized error management
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asyncHandler<T, A extends any[] = []>(
  asyncFn: (...args: A) => Promise<SuccessResponse<T>>
) {
  return async (...args: A): Promise<ApiResult<T>> => {
    try {
      // Execute the async function and await its result
      const result = await asyncFn(...args);

      return result;
    } catch (error) {
      console.log({ error });

      // Handle ApiError instances
      if (error instanceof ApiError) {
        return ApiResponse.Error({
          message: error.message,
          type: error.type,
        });
      }

      if (error instanceof ZodError) {
        return ApiResponse.Error({
          message: error.errors.map((e) => e.message).join(", "),
          type: "VALIDATION",
        });
      }

      // Handle standard JavaScript errors
      if (error instanceof Error) {
        return ApiResponse.Error({
          message: error.message,
          type: "UNKNOWN",
        });
      }

      // Handle any other unexpected error types
      return ApiResponse.Error({
        message: "An unexpected error occurred",
        type: "UNKNOWN",
      });
    }
  };
}
