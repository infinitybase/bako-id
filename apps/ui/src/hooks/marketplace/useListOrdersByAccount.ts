import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import { getPagination } from '@/utils/pagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

type useListOrdersProps = { account?: string; page?: number; limit?: number };

export const useListOrdersByAccount = ({
  account,
  page = 1,
  limit = 12,
}: useListOrdersProps) => {
  const { chainId } = useChainId();
  const queryClient = useQueryClient();

  const { data: orders, ...rest } = useQuery({
    queryFn: async () => {
      const { orders, total } = await marketplaceService.getOrdersByAccount({
        account: account!,
        page,
      });

      const ordersWithMetadata = await Promise.all(
        orders.map(async (order) =>
          getOrderMetadata(order, queryClient, chainId)
        )
      );

      return getPagination({
        data: ordersWithMetadata,
        page,
        limit,
        total,
      });
    },
    queryKey: [MarketplaceQueryKeys.ORDERS, account, page],
    placeholderData: (data) => data,
    enabled: !!account,
  });

  return { orders, ...rest };
};
