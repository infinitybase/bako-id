import BakoIdService from '@/services/bako-id';
import { marketplaceService } from '@/services/marketplace';
import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import {
  getOrderMetadata,
  saveMetadataToLocalStorage,
} from '@/utils/getOrderMetadata';
import { getPagination, type PaginationResult } from '@/utils/pagination';
import { Networks } from '@/utils/resolverNetwork';
import { useInfiniteQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useChainId } from '../useChainId';

type useListOrdersProps = { page?: number; limit: number; search?: string };

export const useListOrders = ({ limit, search }: useListOrdersProps) => {
  const { chainId } = useChainId();

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
        id: search,
        chainId: chainId ?? undefined,
      });
      const sellers = uniqBy(orders, (order) => order.seller).map(
        (order) => order.seller
      );
      const domains = await BakoIdService.names(
        sellers,
        chainId ?? Networks.MAINNET
      );

      const ordersWithMetadata = await Promise.all(
        orders.map(async (order) => await getOrderMetadata(order, chainId))
      );

      saveMetadataToLocalStorage(ordersWithMetadata);

      const ordersWithDomain = ordersWithMetadata.map((order) => ({
        ...order,
        sellerDomain: domains.names.find(
          (domain) =>
            domain.resolver.toLowerCase() === order.seller.toLowerCase()
        )?.name,
      }));

      return getPagination({
        data: ordersWithDomain,
        page: pageParam as number,
        limit,
        total,
      });
    },
    placeholderData: (data) => data,
  });

  return { orders, ...rest };
};
