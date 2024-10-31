import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { Handle } from '../types';

const useGetAllDomainRequests = (
  owner: string,
  options?: UseQueryOptions<Handle[], unknown>
) => {
  // TODO: Refactor, get domains from indexer
  return useQuery({
    queryKey: ['getAllDomains'],
    queryFn: async () => [],
    enabled: !!owner,
    ...options,
  });
};

export { useGetAllDomainRequests };
