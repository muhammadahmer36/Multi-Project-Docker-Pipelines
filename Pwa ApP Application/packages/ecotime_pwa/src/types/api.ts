export interface ApiResponse<T> {
    validation: unknown | null;
    httpStatusCode: number;
    isSuccessfull: boolean;
    data: T;
  }
