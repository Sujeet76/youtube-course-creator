export type ErrorType =
  | "FATAL"
  | "AUTH"
  | "VALIDATION"
  | "NETWORK"
  | "UNKNOWN"
  | "API_ERROR"
  | "NOT_FOUND";

export type SuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  type: ErrorType;
};

export type ApiResult<T> = SuccessResponse<T> | ErrorResponse;

export class ApiResponse {
  static Ok<T>(res: { data: T; message: string }): SuccessResponse<T> {
    return {
      success: true,
      ...res,
    };
  }

  static Error(res: { message: string; type?: ErrorType }): ErrorResponse {
    return {
      success: false,
      message: res.message,
      type: res.type ?? "UNKNOWN",
    };
  }
}

export class ApiError extends Error {
  success = false;
  constructor(
    public type: ErrorType,
    message: string,
    success?: false
  ) {
    super(message);
    this.success = success ?? false;
  }
}
