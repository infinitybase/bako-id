import { useWallet } from '@fuels/react';
import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useResolveOwnerRequests } from '../../../hooks/useResolveOwnerRequests.ts';

export const useSidebar = (handleName?: string) => {
  const { domain: domainParam } = useParams({ strict: false });

  const { wallet } = useWallet();
  const { data: owner } = useResolveOwnerRequests(handleName ?? domainParam);

  const isMyDomain = useMemo(() => {
    if (!owner) return false;
    const address = owner?.Address?.bits ?? owner?.Address?.bits;
    return wallet?.address.toB256() === address;
  }, [owner, wallet]);

  return {
    isMyDomain,
  };
};
