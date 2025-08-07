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
    updatedOrders,
    removeUpdatedOrders,
  } = useProcessingOrdersStore();

  const { data: collectionOrders, ...rest } = useInfiniteQuery<
    PaginationResult<Order>
  >({
    queryKey: [
      MarketplaceQueryKeys.COLLECTION_ORDERS,
      chainId,
      collectionId,
      search,
      sortValue,
      sortDirection,
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

      const filteredData = filterAndUpdateOrdersWithProcessingState({
        items: data.items,
        cancelledOrders,
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
