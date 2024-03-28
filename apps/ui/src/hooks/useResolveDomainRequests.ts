import { resolver } from '@bako-id/sdk';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { ResolverDomainPayload, ResolverReturn } from '../types';

const useResolveDomainRequests = (
  options?: UseMutationOptions<ResolverReturn, unknown, ResolverDomainPayload>,
) => {
  return useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: resolver,
    ...options,
  });
};

export { useResolveDomainRequests };
