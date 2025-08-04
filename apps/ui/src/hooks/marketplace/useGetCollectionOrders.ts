import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { marketplaceService } from '@/services/marketplace';
import { Networks } from '@/utils/resolverNetwork';
import type { Order } from '@/types/marketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { filterAndUpdateOrdersWithProcessingState } from '@/utils/handleOptimisticData';

type UseGetCollectionOrdersProps = {
  page?: number;
  limit: number;
  search?: string;
  sortValue: string;
  sortDirection: 'asc' | 'desc';
  collectionId: string;
};

export const useGetCollectionOrders = ({
  limit,
  search,
  sortValue,
  sortDirection,
  collectionId,
}: UseGetCollectionOrdersProps) => {
  const { chainId } = useChainId();
  const {
    cancelledOrders,
    removeCancelledOrders,
    processingOrders,
    removeProcessingOrder,
    updatedOrders,
    purchasedOrders,
    removePurchasedOrder,
    removeUpdatedOrders,
  } = useProcessingOrdersStore();

  const { data: collectionOrders, ...rest } = useInfiniteQuery<
    PaginationResult<Order>
  >({
    queryKey: [
      MarketplaceQueryKeys.COLLECTION_ORDERS,
      chainId,
      collectionId,
    ],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await marketplaceService.getCollectionOrders({
        page: pageParam as number,
        limit,
        search,
        collectionId,
        chainId: chainId ?? Networks.MAINNET,
        sortValue,
        sortDirection,
      });

      const currentOrderIds = data.items.map((order) => order.id);
      const purchasedOrdersToRemove = purchasedOrders.filter(
        (purchasedOrderId) => !currentOrderIds.includes(purchasedOrderId)
      );

      if (data.items.length >= 1 && purchasedOrders.length > 0) {
        for (const purchasedOrderId of purchasedOrdersToRemove) {
          removePurchasedOrder(purchasedOrderId);
        }
      }

      const filteredData = filterAndUpdateOrdersWithProcessingState({
        items: data.items,
        cancelledOrders,
        removeCancelledOrders,
        processingOrders,
        removeProcessingOrder,
        updatedOrders,
        removeUpdatedOrders,
      })

      return {
        data: filteredData,
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasNextPage: data.pagination.hasNext,
        hasPreviousPage: data.pagination.hasPrev,
      };
    },
    placeholderData: (data) => data,
    enabled: !!chainId && !!collectionId,
  });

  return { collectionOrders, ...rest };
};
