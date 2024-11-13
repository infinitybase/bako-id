import { useGetAllDomainRequests } from '../../../hooks/useGetAllDomainsRequests';

export const useMyHandles = () => {
  const getAllDomains = useGetAllDomainRequests();

  return {
    ...getAllDomains,
  };
};
