"use client";

import { useEffect, useState } from "react";
import { GetReturn } from "./models/model";
import { APIResponse } from "./models/APIResponse";
import { BeseAxios } from "../web-constants/constants";

interface ResponseData<T> {
  data?: APIResponse<T>;
}

export const useFetch = <T>(uri: string): GetReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response: any = await BeseAxios.get(uri);
        console.log("Response:", response);
        if (isMounted && response?.data) {
          setData(response.data.content);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error fetching data:", err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [uri]);

  return { data, error, isLoading };
};
