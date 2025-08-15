import { MarketplaceQueryKeys } from '@/utils/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { Networks } from '@/utils/resolverNetwork';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import { marketplaceService } from '@/services/marketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { filterAndUpdateOrdersWithProcessingState } from '@/utils/handleOptimisticData';

type useListInfiniteOrdersByAddressProps = {
  page?: number;
  limit?: number;
  sellerAddress: string;
};

type UserOrdersResponse = PaginationResult<Order> & {
  totalOrdersUsdPrice: number;
  notListedTotalUsdPrice: number;
};

export const useListInfiniteOrdersByAddress = ({
  sellerAddress,
  page = 0,
  limit,
}: useListInfiniteOrdersByAddressProps) => {
  const { chainId } = useChainId();
  const {
    cancelledOrders,
    updatedOrders,
    removeUpdatedOrders,
  } = useProcessingOrdersStore();

  const {
    data: orders,
    isLoading: isLoadingOrders,
    ...rest
  } = useInfiniteQuery<UserOrdersResponse>({
    queryKey: [MarketplaceQueryKeys.USER_ORDERS, sellerAddress],
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam }) => {
      const { data } = await marketplaceService.listUserOrders({
        page: pageParam as number,
        chainId: chainId ?? Networks.MAINNET,
        limit: limit ?? 10,
        sellerAddress,
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
        totalOrdersUsdPrice: data.totalOrdersUsdPrice,
        notListedTotalUsdPrice: data.notListedTotalUsdPrice,
      };
    },
    placeholderData: (data) => data,
    enabled: chainId !== undefined && chainId !== null && !!sellerAddress,
  });

  return {
    orders,
    isLoading: !sellerAddress ? true : isLoadingOrders,
    ...rest,
  };
};
