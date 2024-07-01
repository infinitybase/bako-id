import { resolver } from '@bako-id/sdk';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ProviderParams, ResolverReturn } from '../types';

const useQueryResolveDomainRequests = (
  domain: string,
  params?: ProviderParams,
  options?: UseQueryOptions<ResolverReturn, unknown, string>,
) => {
  return useQuery({
    queryKey: ['resolveDomain'],
    queryFn: () => resolver(domain, params),
    enabled: !!domain,
    ...options,
  });
};

export { useQueryResolveDomainRequests };
