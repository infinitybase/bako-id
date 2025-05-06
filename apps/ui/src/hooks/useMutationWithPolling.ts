import { waitForQuery } from '@/utils/query';
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query';

/**
 * @description A configuration object for polling a mutation.
 *
 * @template TPayload - The type of the payload for the mutation function.
 * @template TResponse - The type of the response from the mutation function.
 * @template TData - The type of the data to be checked for readiness.
 *
 * @property getQueryKey - A function that returns the query key for the mutation.
 * @property isDataReady - A predicate function that checks if the data is ready.
 */
export interface PollConfig<TPayload, TResponse, TData = unknown> {
  getQueryKey: (payload: TPayload, response: TResponse) => QueryKey;
  isDataReady: (
    data: TData | undefined,
    payload: TPayload,
    response: TResponse
  ) => boolean;
}

/**
 * @description A custom hook that wraps a mutation function and provides polling functionality.
 * It allows you to specify a list of polling configurations, each with its own query key and readiness check.
 * The hook will execute the mutation function and then start polling for each configuration until the data is ready.
 *
 * @template TPayload - The type of the payload for the mutation function.
 * @template TResponse - The type of the response from the mutation function.
 * @template TData - The type of the data to be checked for readiness.
 *
 * @property getQueryKey - A function that returns the query key for the mutation.
 * @property isDataReady - A predicate function that checks if the data is ready.
 *
 * @property mutationOpts - Optional mutation options for the mutation function.
 * @property interval - The polling interval in milliseconds.
 */
export function useMutationWithPolling<TPayload, TResponse, TData = unknown>({
  mutationFn,
  pollConfigs,
  mutationOpts,
  interval = 2_000,
}: {
  mutationFn: (payload: TPayload) => Promise<TResponse>;
  pollConfigs: PollConfig<TPayload, TResponse, TData>[];
  mutationOpts?: UseMutationOptions<TResponse, unknown, TPayload, unknown>;
  interval?: number;
}) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationFn,
    ...mutationOpts,
    onSuccess: async (response, payload, ctx) => {
      // first, we call the original onSuccess function if it exists
      if (mutationOpts?.onSuccess) {
        await mutationOpts.onSuccess(response, payload, ctx);
      }

      // then we start polling for each pollConfig
      const polls = pollConfigs.map(({ getQueryKey, isDataReady }) =>
        waitForQuery<TData>(
          queryClient,
          getQueryKey(payload, response),
          (data) => isDataReady(data, payload, response),
          interval
        )
      );
      await Promise.all(polls);
    },
  });
}
