import { resolver } from '@bako-id/sdk';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ResolverDomainPayload, ResolverReturn } from '../types';

const useResolveDomainRequests = (
  domain: string,
  options?: UseMutationOptions<ResolverReturn, unknown, ResolverDomainPayload>,
) => {
  return useMutation({
    mutationKey: ['resolveDomain'],
    mutationFn: () => resolver(domain),
    ...options,
  });
};

export { useResolveDomainRequests };
