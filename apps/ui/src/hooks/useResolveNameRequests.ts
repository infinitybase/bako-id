import { useMutation } from '@tanstack/react-query';
import { useResolverContract } from './sdk';

const useResolveNameRequests = (address: string) => {
  const resolverContract = useResolverContract();
  return useMutation({
    mutationKey: ['resolveDomainName'],
    mutationFn: async () => resolverContract?.name(address),
  });
};

export { useResolveNameRequests };
