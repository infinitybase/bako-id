import { useQuery } from '@tanstack/react-query';
import { useResolverContract } from './sdk';

const useResolveOwnerRequests = (domain: string) => {
  const resolverContract = useResolverContract();
  return useQuery({
    queryKey: ['resolveOwner', domain],
    queryFn: async () => resolverContract?.owner(domain),
    enabled: !!domain && !!resolverContract,
  });
};

export { useResolveOwnerRequests };
