import { resolver } from '@bako-id/sdk';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ResolverReturn } from '../types';

const useQueryResolveDomainRequests = (
  domain: string,
  options?: UseQueryOptions<ResolverReturn, unknown, string>,
) => {
  return useQuery({
    queryKey: ['resolveDomain'],
    queryFn: () => resolver(domain),
    enabled: !!domain,
    ...options,
  });
};

export { useQueryResolveDomainRequests };
