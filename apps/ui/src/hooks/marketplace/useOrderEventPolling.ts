import {
    type InfiniteData,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { marketplaceService, ORDER_EVENTS } from '@/services/marketplace';
import { useAccount, useChainId } from '@fuels/react';
import { Networks } from '@/utils/resolverNetwork';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { BakoIDQueryKeys, MarketplaceQueryKeys } from '@/utils/constants';
import type { Order } from '@/types/marketplace';
import type { PaginationResult } from '@/utils/pagination';

export const useOrderEventPolling = () => {
    const { chainId } = useChainId();
    const {
        processingOrders,
        updatedOrders,
        cancelledOrders,
        purchasedOrders,
        removeProcessingOrder,
        removeUpdatedOrders,
        removeCancelledOrders,
        removePurchasedOrder,
    } = useProcessingOrdersStore();
    const queryClient = useQueryClient();
    const { account } = useAccount();
    const address = account?.toLowerCase();

    /**
     * Clears storage and invalidates queries based on the event type
     * @param event - The order event type
     * @param txId - The transaction ID to process
     */
    const clearStorageByEvent = (
        event: keyof typeof ORDER_EVENTS,
        txId: string
    ): void => {
        const eventHandlers = {
            [ORDER_EVENTS.OrderCancelledEvent]: () => {
                const orderToRemove = cancelledOrders.find(
                    (order) => order.txId === txId
                );
                if (orderToRemove) {
                    removeCancelledOrders(orderToRemove.orderId);
                    queryClient.invalidateQueries({
                        queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
                    });
                    queryClient.invalidateQueries({
                        queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
                    });
                }
            },
            [ORDER_EVENTS.OrderEditedEvent]: () => {
                const orderToRemove = updatedOrders.find(
                    (order) => order.txId === txId
                );
                if (orderToRemove) {
                    removeUpdatedOrders(orderToRemove.orderId);
                    queryClient.invalidateQueries({
                        queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
                    });
                }
            },
            [ORDER_EVENTS.OrderCreatedEvent]: () => {
                const orderToRemove = processingOrders.find(
                    (order) => order.txId === txId
                );
                queryClient.invalidateQueries({
                    queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
                });
                const getUserOrders: InfiniteData<PaginationResult<Order>> =
                    queryClient.getQueryData([
                        MarketplaceQueryKeys.USER_ORDERS,
                        address,
                    ]) as InfiniteData<PaginationResult<Order>>;


                const order = getUserOrders?.pages
                    ?.flatMap((page) => page.data)
                    .find((order) => order.id === orderToRemove?.orderId);

                if (orderToRemove && order) {
                    removeProcessingOrder(orderToRemove.orderId);
                    queryClient.invalidateQueries({
                        queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
                    });
                }
            },
            [ORDER_EVENTS.OrderExecutedEvent]: () => {
                const orderToRemove = purchasedOrders.find(
                    (order) => order.txId === txId
                );
                if (orderToRemove) {
                    removePurchasedOrder(orderToRemove.orderId);
                    queryClient.invalidateQueries({
                        queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
                    });
                }
            },
        };

        const handler = eventHandlers[event];
        if (handler) {
            handler();
        } else {
            console.log(`Unknown event type: ${event}`);
        }
    };

    /**
     * Collects all transaction IDs from different order arrays with their source events
     * @returns Array of transaction objects with source event and transaction ID
     */
    const getAllTransactionIds = (): { source: ORDER_EVENTS; txId: string }[] => {
        const orderCollections = [
            { orders: processingOrders, event: ORDER_EVENTS.OrderCreatedEvent },
            { orders: updatedOrders, event: ORDER_EVENTS.OrderEditedEvent },
            { orders: cancelledOrders, event: ORDER_EVENTS.OrderCancelledEvent },
            { orders: purchasedOrders, event: ORDER_EVENTS.OrderExecutedEvent },
        ];

        const txIds = new Set<string>();
        const result: { source: ORDER_EVENTS; txId: string }[] = [];

        for (const { orders, event } of orderCollections) {
            for (const order of orders) {
                if (order.txId && !txIds.has(order.txId)) {
                    txIds.add(order.txId);
                    result.push({ source: event, txId: order.txId });
                }
            }
        }

        return result;
    };

    const transactionIds = getAllTransactionIds();

    const { isLoading, error } = useQuery({
        queryKey: ['transactionPolling', transactionIds],
        queryFn: async () => {
            if (transactionIds.length === 0) {
                return null;
            }

            for (const { source, txId } of transactionIds) {
                try {
                    await marketplaceService.getReceiptStatus({
                        txId,
                        chainId: chainId ?? Networks.MAINNET,
                    });

                    clearStorageByEvent(source, txId);
                } catch (error) {
                    console.error(`Error fetching status for txId ${txId}:`, error);
                }
            }

            return null;
        },
        enabled: transactionIds.length > 0,
        refetchInterval: () => {
            const currentTransactionIds = getAllTransactionIds();
            return currentTransactionIds.length > 0 ? 2000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: 0, // Always consider data stale to ensure fresh polling
        gcTime: 0, // Don't cache this data
    });

    return {
        isLoading,
        error,
        transactionIds,
        hasActiveTransactions: transactionIds.length > 0,
    };
};
