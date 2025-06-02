import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

type useListOrderProps = { id: string };

export const useListOrder = ({ id }: useListOrderProps) => {
  const { chainId, isLoading } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, chainId, id],
    queryFn: async () => {
      const order = await marketplaceService.getOrderById({
        id,
        chainId: chainId ?? undefined,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const orderWithMetadata = await getOrderMetadata(order, chainId);

      return orderWithMetadata;
    },
    enabled: !isLoading,
  });

  return { order, ...rest };
};
