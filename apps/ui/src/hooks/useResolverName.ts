import BakoIdService from '@/services/bako-id';
import { BakoIDQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from './useChainId';

export const useResolverName = (account: string) => {
  const { chainId, isFetched } = useChainId();

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [BakoIDQueryKeys.NAME, account, chainId],
    queryFn: async () => {
      return BakoIdService.name(account!, chainId ?? Networks.MAINNET);
    },
    enabled: !!account && isFetched,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { data, isLoading, ...rest };
};
