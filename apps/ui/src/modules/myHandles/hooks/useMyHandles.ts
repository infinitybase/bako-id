import { useWallet } from '@fuels/react';
import { useGetAllDomainRequests } from '../../../hooks/useGetAllDomainsRequests';

export const useMyHandles = () => {
  const { wallet } = useWallet();
  const getAllDomains = useGetAllDomainRequests(wallet?.address.toB256() ?? '');

  return {
    ...getAllDomains,
  };
};
