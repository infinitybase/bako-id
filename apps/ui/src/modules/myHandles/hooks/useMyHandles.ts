import { useFuelConnect } from '../../../hooks';
import { useGetAllDomainRequests } from '../../../hooks/useGetAllDomainsRequests';

export const useMyHandles = () => {
  const { wallet } = useFuelConnect();
  const getAllDomains = useGetAllDomainRequests(wallet?.address.toB256() ?? '');

  return {
    ...getAllDomains,
  };
};
