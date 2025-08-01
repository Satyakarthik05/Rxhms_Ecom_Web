import { useState } from "react";
import { BeseAxios } from "../web-constants/constants";

// Define a new type that includes executeDelete method
export interface DeleteResponse<T> {
  data: T | any;
  loading: boolean;
  error: Error | null;
  executeDelete: (uri: string, params: any) => Promise<void>;
}

export const useDeleteByParams = <T>(): DeleteResponse<T> => {
  const [data, setData] = useState<T | any>(true);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const executeDelete = async (uri: string, param: any): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await BeseAxios.delete(uri, {
        params: param,
      });
      console.log("Delete Response", response);
      setData(response.data.content);
      return response.data.content;
    } catch (err: any) {
      console.log(err);
      setError(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executeDelete };
};
