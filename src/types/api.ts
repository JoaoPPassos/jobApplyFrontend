// Espelha SuccessResponse / FailResponse do backend (src/shared/response)
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
