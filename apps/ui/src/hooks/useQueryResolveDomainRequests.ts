import { useQuery } from '@tanstack/react-query';
import { useResolverContract } from './sdk';

const useQueryResolveDomainRequests = (domain: string) => {
  const resolverContract = useResolverContract();
  return useQuery({
    queryKey: ['resolveDomain', domain],
    queryFn: async () => resolverContract?.addr(domain),
    enabled: !!domain && !!resolverContract,
  });
};

export { useQueryResolveDomainRequests };
