import { MarketplaceQueryKeys } from '@/utils/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { Networks } from '@/utils/resolverNetwork';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import { marketplaceService } from '@/services/marketplace';
import { useProcessingOrders } from '@/contexts/ProcessingOrdersContext';
import { useMemo } from 'react';

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
  const { cancelledOrdersId, removeCancelledOrdersId, processingOrders, removeProcessingOrder, isPolling } =
    useProcessingOrders();

  const activatePolling = useMemo(() => {
    return processingOrders.length > 0 && !isPolling;
  }, [processingOrders, isPolling]);

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

      const currentOrderIds = data.items.map((order) => order.id);
      const cancelledOrdersToRemove = cancelledOrdersId.filter((cancelledId) =>
        !currentOrderIds.includes(cancelledId)
      );

      if (data.items.length >= 1 && cancelledOrdersId.length > 0) {
        for (const orderId of cancelledOrdersToRemove) {
          removeCancelledOrdersId(orderId);
        }
      }

      const filteredData = data.items.filter(
        (order) => !cancelledOrdersId.includes(order.id)
      );

      if (filteredData.length > 0 && processingOrders.length > 0) {
        for (const processingOrder of processingOrders) {
          const isOrderInFilteredData = filteredData.some((item) => item.id === processingOrder.orderId);
          if (isOrderInFilteredData) {
            removeProcessingOrder(processingOrder.orderId);
          }
        }
      }


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
    enabled: !!chainId && !!sellerAddress,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: activatePolling ? 5000 : false,
    refetchIntervalInBackground: true,
  });

  return {
    orders,
    isLoading: !sellerAddress ? true : isLoadingOrders,
    ...rest,
  };
};
