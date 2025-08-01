export interface GetReturn<T> {
  data: T | null;
  error: any | null;
  isLoading: boolean;
  setData?: (data: T | null) => void;
  fetchData?: (
    isMounted: boolean,
    uri: string,
    paramData: Record<string, unknown>
  ) => Promise<void>;
}

export interface GetReturnOfFetch<T> {
  data: T | null;
  error: any | null;
  isLoading: boolean;
  fetchData?: (
    isMounted: boolean,
    uri: string,
    paramData: string | number
  ) => Promise<void>;
  setData?: (data: T | null) => void;
}

export interface PostResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  executePost: (uri: string, postData: any) => Promise<void>;
}
export interface PutResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  executePut: (uri: string, postData: any) => Promise<void>;
}

export interface PatchResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  executePatch: (uri: string, postData: any) => Promise<void>;
}
