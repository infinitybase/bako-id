import type { Order } from "@/types/marketplace";
import type { ProcessingOrder, ProcessingUpdatedOrder } from "@/modules/marketplace/stores/processingOrdersStore";

export const filterAndUpdateOrdersWithProcessingState = ({
    items,
    cancelledOrders,
    removeCancelledOrders,
    processingOrders,
    removeProcessingOrder,
    updatedOrders,
    removeUpdatedOrders,
}: {
    items: Order[];
    cancelledOrders: { orderId: string, owner: string }[];
    removeCancelledOrders: (orderId: string) => void;
    processingOrders: ProcessingOrder[];
    removeProcessingOrder: (orderId: string) => void;
    updatedOrders: ProcessingUpdatedOrder[];
    removeUpdatedOrders: (orderId: string) => void;
}) => {
    const currentOrderIds = items.map((order) => order.id);
    const cancelledOrdersToRemove = cancelledOrders.filter(
        (cancelledOrder) => !currentOrderIds.includes(cancelledOrder.orderId)
    );

    // Remove cancelled orders from the store if it's not in the current orders
    // Which means that our processor already removed it
    if (items.length >= 1 && cancelledOrders.length > 0) {
        for (const order of cancelledOrdersToRemove) {
            removeCancelledOrders(order.orderId);
        }
    }

    // Remove cancelled orders from the items, to not be displayed in the user profile list
    let filteredData = items.filter(
        (order) => !cancelledOrders.some(
            (cancelledOrder) => cancelledOrder.orderId === order.id
        )
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
            const isOrderInCancelledOrders = cancelledOrders.some(
                (cancelledOrder) => cancelledOrder.orderId === processingOrder.orderId
            );
            if (isOrderInCancelledOrders && !isOrderInFilteredData) {
                removeCancelledOrders(processingOrder.orderId);
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
