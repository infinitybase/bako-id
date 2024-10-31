import type { RegisterPayload } from '@bako-id/sdk';
import { useMutation } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useFuelConnect, useResolveDomainRequests } from '.';
import { useRegistryContract } from './sdk';
import { useResolveNameRequests } from './useResolveNameRequests';
import { useResolveOwnerRequests } from './useResolveOwnerRequests';

export const useDomain = (newDomain?: string) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();

  const registryContract = useRegistryContract();

  const registerDomain = useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: async (payload: RegisterPayload) =>
      registryContract?.register(payload),
  });
  const resolveDomain = useResolveDomainRequests(newDomain ?? domain);
  const resolveName = useResolveNameRequests(wallet?.address.toB256() ?? '');
  const resolveOwner = useResolveOwnerRequests(newDomain ?? domain);

  return {
    registerDomain,
    resolveName,
    resolveOwner,
    resolveDomain,
  };
};
