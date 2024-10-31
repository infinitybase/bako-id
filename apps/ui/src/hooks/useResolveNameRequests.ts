import { resolverName } from '@bako-id/sdk';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { Address } from 'fuels';
import type { ResolverDomainPayload } from '../types';

const useResolveNameRequests = (
  address: string | Address,
  options?: UseMutationOptions<string | null, unknown, ResolverDomainPayload>,
) => {
  return useMutation({
    mutationKey: ['resolveDomainName'],
    mutationFn: () => resolverName(address),
    ...options,
  });
};

export { useResolveNameRequests };
