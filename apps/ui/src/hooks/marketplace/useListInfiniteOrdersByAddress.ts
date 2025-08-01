import { MarketplaceQueryKeys } from '@/utils/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { Networks } from '@/utils/resolverNetwork';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';
import { marketplaceService } from '@/services/marketplace';
import { useMemo } from 'react';
import {
  type ProcessingOrder,
  type ProcessingUpdatedOrder,
  useProcessingOrdersStore,
} from '@/modules/marketplace/stores/processingOrdersStore';

const filterAndUpdateOrdersWithProcessingState = ({
  items,
  cancelledOrdersId,
  removeCancelledOrdersId,
  processingOrders,
  removeProcessingOrder,
  updatedOrders,
  removeUpdatedOrders,
}: {
  items: Order[];
  cancelledOrdersId: string[];
  removeCancelledOrdersId: (orderId: string) => void;
  processingOrders: ProcessingOrder[];
  removeProcessingOrder: (orderId: string) => void;
  updatedOrders: ProcessingUpdatedOrder[];
  removeUpdatedOrders: (orderId: string) => void;
}) => {
  const currentOrderIds = items.map((order) => order.id);
  const cancelledOrdersToRemove = cancelledOrdersId.filter(
    (cancelledId) => !currentOrderIds.includes(cancelledId)
  );

  // Remove cancelled orders from the store if it's not in the current orders
  // Which means that our processor already removed it
  if (items.length >= 1 && cancelledOrdersId.length > 0) {
    for (const orderId of cancelledOrdersToRemove) {
      removeCancelledOrdersId(orderId);
    }
  }

  // Remove cancelled orders from the items, to not be displayed in the user profile list
  let filteredData = items.filter(
    (order) => !cancelledOrdersId.includes(order.id)
  );

  // Remove processing orders from the store if it's in the list
  // Which means that our processor already added it
  if (filteredData.length > 0 && processingOrders.length > 0) {
    for (const processingOrder of processingOrders) {
      const isOrderInFilteredData = filteredData.some(
        (item) => item.id === processingOrder.orderId
      );

      // If it's in the cancelled orders and it's NOT in the filtered data
      // We should clear the cancelledOrdersId because our processor already cancelled it
      const isOrderInCancelledOrders = cancelledOrdersId.includes(processingOrder.orderId);
      if (isOrderInCancelledOrders && !isOrderInFilteredData) {
        removeCancelledOrdersId(processingOrder.orderId);
      }
      if (isOrderInFilteredData) {
        removeProcessingOrder(processingOrder.orderId);
      }
    }
  }

  if (filteredData.length > 0 && updatedOrders.length > 0) {
    const updatedFilteredData = filteredData.map((order) => {
      const matchingUpdatedOrder = updatedOrders.find(
        (updatedOrder) => order.id === updatedOrder.orderId
      );

      if (matchingUpdatedOrder) {
        return {
          ...order,
          price: {
            ...order.price,
            amount: matchingUpdatedOrder.newAmount,
            raw: matchingUpdatedOrder.newRaw,
            usd: matchingUpdatedOrder.usd,
          },
        };
      }

      return order;
    });

    // Remove updated orders from the store only if the order's current amount match the new amount
    // Which means that our processor already updated them and the changes are reflected
    for (const updatedOrder of updatedOrders) {
      const matchingOrder = filteredData.find(
        (item) => item.id === updatedOrder.orderId
      );
      if (
        matchingOrder &&
        matchingOrder.price.amount === updatedOrder.newAmount
      ) {
        removeUpdatedOrders(updatedOrder.orderId);
      }
    }

    filteredData = updatedFilteredData;
  }

  return filteredData;
};

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
    cancelledOrdersId,
    removeCancelledOrdersId,
    processingOrders,
    removeProcessingOrder,
    isPollingEnabled,
    updatedOrders,
    removeUpdatedOrders,
  } = useProcessingOrdersStore();

  const activatePolling = useMemo(() => {
    const anyActionInProgress = processingOrders.length > 0 || updatedOrders.length > 0 || cancelledOrdersId.length > 0;
    return anyActionInProgress && isPollingEnabled;
  }, [processingOrders, isPollingEnabled, updatedOrders, cancelledOrdersId]);

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

      const filteredData = activatePolling ? filterAndUpdateOrdersWithProcessingState({
        items: data.items,
        cancelledOrdersId,
        removeCancelledOrdersId,
        processingOrders,
        removeProcessingOrder,
        updatedOrders,
        removeUpdatedOrders,
      }) : data.items;

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
    refetchOnMount: activatePolling,
    refetchOnWindowFocus: false,
    refetchInterval: activatePolling ? 5000 : false,
    refetchIntervalInBackground: activatePolling,
  });

  return {
    orders,
    isLoading: !sellerAddress ? true : isLoadingOrders,
    ...rest,
  };
};
