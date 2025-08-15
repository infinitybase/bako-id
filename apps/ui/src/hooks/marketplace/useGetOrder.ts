import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useQuery } from '@tanstack/react-query';
import { isNumber } from 'lodash';
import { useChainId } from '../useChainId';

type useGetOrderProps = { id: string };

export const useGetOrder = ({ id }: useGetOrderProps) => {
  const { chainId } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ORDER, chainId, id],
    queryFn: async () => {
      const { data } = await marketplaceService.getOrder({
        orderId: id,
        chainId: chainId ?? Networks.MAINNET,
      });

      return data;
    },
    enabled: isNumber(chainId) && !!id,
  });

  return { order, ...rest };
};
