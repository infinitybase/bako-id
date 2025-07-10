import { MarketplaceQueryKeys } from '@/helpers/constant';
import { marketplaceService } from '@/services/marketplace';
import { Networks } from '@/utils';
import { useQuery } from '@tanstack/react-query';

type useGetOrderProps = { id: string; chainId: number };

export const useGetOrder = ({ id, chainId }: useGetOrderProps) => {
  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, id],
    queryFn: async () => {
      const { data } = await marketplaceService.getOrder({
        orderId: id,
        chainId: chainId ?? Networks.MAINNET,
      });

      return data;
    },
    enabled: !!chainId,
  });

  return { order, ...rest };
};
