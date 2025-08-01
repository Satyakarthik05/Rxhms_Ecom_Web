import { useState } from "react";
import { PatchResponse } from "./models/model";
import { BeseAxios } from "../web-constants/constants";

export const usePatchByParams = <T>(): PatchResponse<any> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const executePatch = async (uri: string, paramValue: Record<string, any>) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Executing PUT request:", paramValue);
      const response: any = await BeseAxios.patch(uri, null, {
        params: paramValue,
      });
      console.log("Response:", response);
      setData(response.data.content);
      return response.data.content;
    } catch (err) {
      setError(err as Error);
      console.error("Error:", err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePatch };
};
