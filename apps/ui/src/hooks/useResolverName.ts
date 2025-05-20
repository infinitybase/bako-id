import BakoIdService from '@/services/bako-id';
import { BakoIDQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useAccount } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { ZeroBytes32 } from 'fuels';
import { isNil } from 'lodash';
import { useChainId } from './useChainId';

export const useResolverName = () => {
  const { account } = useAccount();
  const { chainId } = useChainId();

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [BakoIDQueryKeys.NAME, account ?? ZeroBytes32, chainId],
    queryFn: async () => {
      return BakoIdService.name(account!, chainId ?? Networks.MAINNET);
    },
    enabled: !!account && !isNil(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { data, isLoading, ...rest };
};
