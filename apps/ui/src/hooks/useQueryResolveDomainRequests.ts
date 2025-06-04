import BakoIdService from '@/services/bako-id';
import { Networks } from '@/utils/resolverNetwork';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChainId';

const useQueryResolveDomainRequests = (domain: string) => {
  const { chainId, isFetched } = useChainId();
  return useQuery({
    queryKey: ['resolveDomain', domain, chainId],
    queryFn: async () =>
      BakoIdService.addr(domain, chainId ?? Networks.MAINNET),
    enabled: !!domain && isFetched,
    refetchOnWindowFocus: false,
  });
};

export { useQueryResolveDomainRequests };
