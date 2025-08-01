import { useState } from "react";
import { PostResponse } from "./models/model";
import { BeseAxios } from "../web-constants/constants";

export const usePostByParams = <T>(): PostResponse<T> => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const executePost = async (uri: string, postData: any): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const responsea: any = await BeseAxios.post(uri, null, {
        params: postData,
      });
      setData(responsea.data);
      return responsea.data;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePost };
};
