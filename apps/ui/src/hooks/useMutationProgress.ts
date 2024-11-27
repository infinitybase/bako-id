import type { DefaultError, UseMutationResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useMutationProgress = <
  TData = unknown,
  TError = DefaultError,
  TVariables = unknown,
  TContext = unknown,
>(
  mutation: UseMutationResult<TData, TError, TVariables, TContext>
) => {
  const [connectProgress, setConnectProgress] = useState(0);

  useEffect(() => {
    if (mutation.status === 'pending') {
      setConnectProgress(33);

      setTimeout(() => {
        setConnectProgress(66);
      }, 700);
    }

    if (mutation.status === 'success') {
      setConnectProgress(100);
    }

    if (mutation.status === 'error' || mutation.status === 'idle') {
      setConnectProgress(0);
    }

    return () => {
      setConnectProgress(0);
    };
  }, [mutation.status]);

  return connectProgress;
};
