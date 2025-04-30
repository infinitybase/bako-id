import { marketplaceService } from '@/services/marketplace';
import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getOrderMetadata } from '@/utils/getOrderMetadata';
import { getPagination, type PaginationResult } from '@/utils/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

type useListOrdersProps = { page?: number; limit?: number; id?: string };

export const useListOrders = ({ limit = 12, id }: useListOrdersProps) => {
  const { chainId } = useChainId();

  const { data: orders, ...rest } = useInfiniteQuery<PaginationResult<Order>>({
    queryKey: [MarketplaceQueryKeys.ORDERS, chainId, id],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      const totalPages = Math.ceil(total / limit);
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 1 }) => {
      const { orders, total } = await marketplaceService.getOrders({
        page: pageParam as number,
        id,
      });
      const ordersWithMetadata = await Promise.all(
        orders.map(async (order) => await getOrderMetadata(order, chainId))
      );

      return getPagination({
        data: ordersWithMetadata,
        page: pageParam as number,
        limit,
        total,
      });
    },
    placeholderData: (data) => data,
  });

  return { orders, ...rest };
};
