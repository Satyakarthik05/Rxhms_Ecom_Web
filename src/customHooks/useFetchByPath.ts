"use client";

import { useEffect, useRef, useState } from "react";
import { GetReturn, GetReturnOfFetch } from "./models/model";
import { BeseAxios } from "../web-constants/constants";

export const useFetchByPath = <T>(
  baseUri: string,
  id: string | number
): GetReturnOfFetch<T> => {
  const [data, setData] = useState<null | T>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const fetchData = async (
    isMounted: boolean,
    baseUri: string,
    pathData: string | number
  ) => {
    try {
      console.log("in HOOk path", pathData);
      const fullUri = `${baseUri}/${pathData}`;
      const response: any = await BeseAxios.get(fullUri);

      if (isMounted && response) {
        setData(response.data.content as T);
      }
    } catch (err: any) {
      if (isMounted) {
        setError(err);
        console.log(err);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchData(isMounted, baseUri, idRef.current);
    return () => {
      isMounted = false;
    };
  }, [baseUri]);

  return { data, error, isLoading, fetchData };
};
