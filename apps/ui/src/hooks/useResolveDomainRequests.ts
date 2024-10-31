import { useMutation } from '@tanstack/react-query';
import { useResolverContract } from './sdk';

const useResolveDomainRequests = (domain: string) => {
  const resolverContract = useResolverContract();
  return useMutation({
    mutationKey: ['resolveDomain'],
    mutationFn: async () => resolverContract?.addr(domain),
    retryDelay: 1000,
  });
};

export { useResolveDomainRequests };
