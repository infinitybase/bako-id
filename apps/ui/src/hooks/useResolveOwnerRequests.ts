import { useQuery } from '@tanstack/react-query';
import { useResolverContract } from './sdk';

const useResolveOwnerRequests = (domain: string) => {
  const resolverContract = useResolverContract();
  return useQuery({
    queryKey: ['resolveOwner'],
    queryFn: async () => resolverContract?.owner(domain),
    enabled: !!domain,
  });
};

export { useResolveOwnerRequests };
