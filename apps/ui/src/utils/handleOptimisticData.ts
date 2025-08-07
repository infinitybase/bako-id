import type { Order } from '@/types/marketplace';
import type { ProcessingUpdatedOrder } from '@/modules/marketplace/stores/processingOrdersStore';

export const filterAndUpdateOrdersWithProcessingState = ({
    items,
    cancelledOrders,
    updatedOrders,
    removeUpdatedOrders,
}: {
    items: Order[];
    cancelledOrders: { orderId: string; owner: string }[];
    updatedOrders: ProcessingUpdatedOrder[];
    removeUpdatedOrders: (orderId: string) => void;
}) => {
    // Remove cancelled orders from the items, to not be displayed in the user profile list
    let filteredData = items.filter(
        (order) =>
            !cancelledOrders.some(
                (cancelledOrder) => cancelledOrder.orderId === order.id
            )
    );

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
                        image: matchingUpdatedOrder.assetIcon
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
