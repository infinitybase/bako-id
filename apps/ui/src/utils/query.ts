import type { QueryClient, QueryKey } from '@tanstack/react-query';

const TRUE = true;

/**
 * @description Wait for a query to return data that matches the predicate.
 *
 * @param queryClient - The query client instance.
 * @param queryKey - The query key to wait for.
 * @param predicate - A function that takes the query data and returns true if the data is ready.
 * @param interval - The interval in milliseconds to wait before checking the query again (default: 2000).
 * @template T - The type of the query data.
 * @returns A promise that resolves when the predicate is satisfied.
 */
export async function waitForQuery<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  predicate: (data: T | undefined) => boolean,
  interval = 2_000
) {
  while (TRUE) {
    // invalidate the query to ensure we have the latest data
    await queryClient.invalidateQueries({ queryKey, refetchType: 'all' });
    const data = queryClient.getQueryData<T>(queryKey);
    // stop if the predicate is satisfied
    if (predicate(data)) return;

    // wait for the next interval
    await new Promise((res) => setTimeout(res, interval));
  }
}
