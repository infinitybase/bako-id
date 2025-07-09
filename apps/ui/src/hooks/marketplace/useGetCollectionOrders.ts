import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { newMarketplaceService } from '@/services/new-marketplace';
import { Networks } from '@/utils/resolverNetwork';
import type { Order } from '@/types/marketplace';

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
  const { chainId, isLoading } = useChainId();

  const { data: collectionOrders, ...rest } = useInfiniteQuery<
    PaginationResult<Order>
  >({
    queryKey: [
      MarketplaceQueryKeys.COLLECTION_ORDERS,
      chainId,
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
      const { data } = await newMarketplaceService.getCollectionOrders({
        page: pageParam as number,
        limit,
        search,
        collectionId,
        chainId: chainId ?? Networks.MAINNET,
        sortValue,
        sortDirection,
      });

      return {
        data: data.items,
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasNextPage: data.pagination.hasNext,
        hasPreviousPage: data.pagination.hasPrev,
      };
    },
    placeholderData: (data) => data,
    enabled: !isLoading,
  });

  return { collectionOrders, ...rest };
};
