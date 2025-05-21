import { marketplaceService } from '@/services/marketplace';
import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import {
  getOrderMetadata,
  saveMetadataToLocalStorage,
} from '@/utils/getOrderMetadata';
import { getPagination, type PaginationResult } from '@/utils/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

type useListOrdersProps = { page?: number; limit: number; search?: string };

export const useListOrders = ({ limit, search }: useListOrdersProps) => {
  const { chainId, isLoading } = useChainId();

  const { data: orders, ...rest } = useInfiniteQuery<PaginationResult<Order>>({
    queryKey: [MarketplaceQueryKeys.ALL_ORDERS, chainId, search],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 1 }) => {
      const { orders, total } = await marketplaceService.getOrders({
        page: pageParam as number,
        limit,
        search,
        chainId: chainId ?? undefined,
      });

      const ordersWithMetadata = await Promise.all(
        orders.map(async (order) => await getOrderMetadata(order, chainId))
      );

      saveMetadataToLocalStorage(ordersWithMetadata);

      return getPagination({
        data: ordersWithMetadata,
        page: pageParam as number,
        limit,
        total,
      });
    },
    placeholderData: (data) => data,
    enabled: !isLoading,
  });

  return { orders, ...rest };
};
