import { MarketplaceQueryKeys } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { marketplaceService } from '@/services/marketplace';
import { Networks } from '@/utils/resolverNetwork';

type useGetOrderProps = { id: string };

export const useGetOrder = ({ id }: useGetOrderProps) => {
  const { chainId, isLoading } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, chainId, id],
    queryFn: async () => {
      const { data } = await marketplaceService.getOrder({
        orderId: id,
        chainId: chainId ?? Networks.MAINNET,
      });

      return data;
    },
    enabled: !isLoading,
  });

  return { order, ...rest };
};
