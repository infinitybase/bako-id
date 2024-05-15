import { owner } from '@bako-id/sdk';
import { useQuery, type UseMutationOptions } from '@tanstack/react-query';
import type { ResolverDomainPayload, ResolverReturn } from '../types';

const useResolveOwnerRequests = (
  domain: string,
  options?: UseMutationOptions<
    ResolverReturn | null,
    unknown,
    ResolverDomainPayload
  >,
) => {
  return useQuery({
    queryKey: ['resolveOwner'],
    queryFn: () => owner(domain),
    enabled: !!domain,
    ...options,
  });
};

export { useResolveOwnerRequests };
