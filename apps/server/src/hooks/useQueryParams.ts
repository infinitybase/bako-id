'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type QueryParamValue = string;
type QueryStates<T> = Record<keyof T, QueryParamValue>;

type UseQueryParamsOptions<T> = T;

export const useQueryParams = <T extends Record<string, string>>(
  initialState: UseQueryParamsOptions<T>
) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<QueryStates<T>>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const initialQuery: T = { ...initialState };

    for (const key of Object.keys(initialState)) {
      const paramValue = params.get(key);
      if (paramValue !== null) {
        initialQuery[key as keyof T] = paramValue as T[keyof T];
      }
    }

    return initialQuery;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [query, router]);

  const handleChangeQuery = <K extends keyof T>(key: K, value: T[K] | '') => {
    setQuery((prevQuery) => {
      const newQuery = { ...prevQuery };
      if (value === '') {
        delete newQuery[key];
      } else {
        newQuery[key] = value;
      }
      return newQuery;
    });
  };

  return { query, handleChangeQuery };
};
