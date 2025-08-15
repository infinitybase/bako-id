import { MarketplaceQueryKeys } from '@/helpers/constant';
import { marketplaceService } from '@/services/marketplace';
import { NetworkId } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { isNumber } from 'lodash';

type useGetOrderProps = { id: string; chainId: number };

export const useGetOrder = ({ id, chainId }: useGetOrderProps) => {
  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, id],
    queryFn: async () => {
      const { data } = await marketplaceService.getOrder({
        orderId: id,
        chainId: chainId ?? NetworkId.MAINNET,
      });

      return data;
    },
    enabled: isNumber(chainId),
  });

  return { order, ...rest };
};
