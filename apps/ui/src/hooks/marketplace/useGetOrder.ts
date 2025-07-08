import { MarketplaceQueryKeys } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { newMarketplaceService } from '@/services/new-marketplace';
import { Networks } from '@/utils/resolverNetwork';

type useGetOrderProps = { id: string };

export const useGetOrder = ({ id }: useGetOrderProps) => {
  const { chainId, isLoading, isFetched } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, chainId, id],
    queryFn: async () => {
      const { data } = await newMarketplaceService.getOrder({
        orderId: id,
        chainId: chainId ?? Networks.MAINNET,
      });

      return data;
    },
    enabled: !isLoading && isFetched,
  });

  return { order, ...rest };
};
