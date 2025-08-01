import { useState } from "react";
import { PutResponse } from "./models/model";
import { BeseAxios } from "../web-constants/constants";

export const usePutByBody = <T>(): PutResponse<T> => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const executePut = async (uri: string, postData: any): Promise<void> => {
    setLoading(true);
    setError(null);
    console.log("sss");

    try {
      console.log("usePutByBody Hook", postData);

      const responsea: any = await BeseAxios.put(uri, postData);
      console.log("upadte", responsea);
      setData(responsea.data.content);
      return responsea.data.content;
    } catch (err: any) {
      setError(err);
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePut };
};
