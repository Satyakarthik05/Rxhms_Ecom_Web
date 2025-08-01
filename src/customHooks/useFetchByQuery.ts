import { useEffect, useRef, useState } from "react";
import { GetReturn } from "./models/model";
import { BeseAxios } from "../web-constants/constants";

export const useFetchByQuery = <T>(
  uri: string,
  paramsData: Record<string, unknown>
): GetReturn<T> => {
  const [data, setData] = useState<null | T>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const paramsRef = useRef(paramsData);

  useEffect(() => {
    paramsRef.current = paramsData;
  }, [paramsData]);

  const fetchData = async (
    isMounted: boolean,
    uri: string,
    paramData: Record<string, unknown>
  ) => {
    try {
      const response: any = await BeseAxios.get(uri, {
        params: paramData,
      });

      if (isMounted && response) {
        setData(response.data.content);
      }
      return response.data.content;
    } catch (err: any) {
      if (isMounted) {
        setError(err);
      }
      return err;
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted, uri, paramsRef.current);
    return () => {
      isMounted = false;
    };
  }, [uri]);

  return { data, error, isLoading, setData, fetchData };
};
