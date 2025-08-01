import { useState } from "react";
import { PostResponse } from "./models/model";
import { BeseAxios } from "../web-constants/constants";

export const usePostByBody = <T>(): PostResponse<T> => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const executePost = async (uri: string, postData: any): Promise<any> => {
    setLoading(true);
    setError(null);
    console.log("sss");

    try {
      console.log("usePostByBody Hook", postData);

      const responsea: any = await BeseAxios.post(uri, postData);
      console.log("responsea", responsea);
      setData(responsea.data.content);
      return responsea.data.content;
    } catch (err: any) {
      setError(err);
      console.log("error", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePost };
};
