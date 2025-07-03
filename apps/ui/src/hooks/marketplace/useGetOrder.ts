import { MarketplaceQueryKeys } from '@/utils/constants';
import { useChainId } from '../useChainId';
import { newMarketplaceService } from '@/services/new-marketplace';
import { useQuery } from '@tanstack/react-query';
import { Networks } from '@/utils/resolverNetwork';

type UseGetOrderProps = {
  orderId: string;
};

export const useGetOrder = ({ orderId }: UseGetOrderProps) => {
  const { chainId, isLoading } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, chainId],
    queryFn: async () => {
      const { data } = await newMarketplaceService.getOrder({
        orderId,
        chainId: chainId ?? Networks.MAINNET,
      });

      return {
        data,
      };
    },
    enabled: !isLoading,
  });

  return { order, ...rest };
};
