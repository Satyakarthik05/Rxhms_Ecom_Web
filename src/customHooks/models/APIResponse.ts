export interface APIResponse<T> {
  content?: T;
  errorPresent?: boolean;
  apiError?: ApiError;
  message?: string;
  messages?: Record<string, string>;
  responseCode?: ResponseCode;
  responseType?: ResponseType;
}

export interface ApiError {
  message: string;
  debugMessage?: string;
}
export enum ResponseCode {
  INVALID_INPURT = 400,
  SUCCESS = 200,
  NO_DATA = 404,
  CRASH = 500,
  CREATE = 201,
}
