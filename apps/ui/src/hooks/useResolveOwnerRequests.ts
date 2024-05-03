import { owner } from '@bako-id/sdk';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ResolverDomainPayload, ResolverReturn } from '../types';

const useResolveOwnerRequests = (
  domain: string,
  options?: UseMutationOptions<
    ResolverReturn | null,
    unknown,
    ResolverDomainPayload
  >,
) => {
  return useMutation({
    mutationKey: ['resolveOwner'],
    mutationFn: () => owner(domain),
    ...options,
  });
};

export { useResolveOwnerRequests };
