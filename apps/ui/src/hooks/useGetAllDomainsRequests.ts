import { getAll } from '@bako-id/sdk';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { Handle } from '../types';

const useGetAllDomainRequests = (
  owner: string,
  options?: UseQueryOptions<Handle[], unknown>,
) => {
  return useQuery({
    queryKey: ['getAllDomains'],
    queryFn: () => getAll(owner),
    enabled: !!owner,
    ...options,
  });
};

export { useGetAllDomainRequests };
