import { MarketplaceQueryKeys } from '@/helpers/constant';
import { newMarketplaceService } from '@/services/new-marketplace';
import { Networks } from '@/utils';
import { useQuery } from '@tanstack/react-query';

type useGetOrderProps = { id: string; chainId: number };

export const useGetOrder = ({ id, chainId }: useGetOrderProps) => {
  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, id],
    queryFn: async () => {
      const { data } = await newMarketplaceService.getOrder({
        orderId: id,
        chainId: chainId ?? Networks.MAINNET,
      });

      return data;
    },
    enabled: !!chainId,
  });

  return { order, ...rest };
};
