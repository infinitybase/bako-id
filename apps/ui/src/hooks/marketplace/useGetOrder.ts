import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

type useGetOrderProps = { id: string };

export const useGetOrder = ({ id }: useGetOrderProps) => {
  const { chainId, isLoading, isFetched } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, chainId, id],
    queryFn: async () => {
      const order = await marketplaceService.getOrderById({
        id,
        chainId: chainId ?? undefined,
      });

      if (!order) {
        return null;
      }

      const orderWithMetadata = await getOrderMetadata(order, chainId);

      return orderWithMetadata;
    },
    enabled: !isLoading && isFetched,
  });

  return { order, ...rest };
};
