import { useWallet } from '@fuels/react';
import { useGetGracePeriodRequest } from './useGetGracePeriodRequests';

export const useGetGracePeriod = (owner: string) => {
  const { wallet } = useWallet();
  const gracePeriod = useGetGracePeriodRequest(owner, {
    account: wallet ?? undefined,
  });

  return gracePeriod;
};
