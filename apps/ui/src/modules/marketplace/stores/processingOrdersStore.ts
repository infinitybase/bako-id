import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProcessingOrder {
    orderId: string;
    image: string;
    assetId: string;
    timestamp: number;
}

export interface ProcessingUpdatedOrder {
    orderId: string;
    oldAmount: number;
    oldRaw: string;
    newAmount: number;
    newRaw: string;
    usd: number;
}


interface ProcessingOrdersState {
    processingOrders: ProcessingOrder[];
    cancelledOrdersId: string[];
    purchasedOrders: string[];
    updatedOrders: ProcessingUpdatedOrder[];
    isPollingEnabled: boolean;

    // Actions
    addProcessingOrders: (order: ProcessingOrder) => void;
    removeProcessingOrder: (orderId: string) => void;
    addCancelledOrdersId: (orderId: string) => void;
    removeCancelledOrdersId: (orderId: string) => void;
    setIsPollingEnabled: (isPolling: boolean) => void;
    clearCancelledOrdersId: () => void;
    addPurchasedOrder: (orderId: string) => void;
    removePurchasedOrder: (orderId: string) => void;
    addUpdatedOrders: (order: ProcessingUpdatedOrder) => void;
    removeUpdatedOrders: (orderId: string) => void;
}

export const useProcessingOrdersStore = create<ProcessingOrdersState>()(
    persist(
        (set) => ({
            processingOrders: [],
            cancelledOrdersId: [],
            purchasedOrders: [],
            updatedOrders: [],
            isPollingEnabled: true,

            addPurchasedOrder: (orderId: string) => {
                set((state) => ({
                    purchasedOrders: [...state.purchasedOrders, orderId],
                }));
            },

            removePurchasedOrder: (orderId: string) => {
                set((state) => ({
                    purchasedOrders: state.purchasedOrders.filter(
                        (currentOrderId) => currentOrderId !== orderId
                    ),
                }));
            },

            addProcessingOrders: (order: ProcessingOrder) => {
                set((state) => ({
                    processingOrders: [...state.processingOrders, order],
                }));
            },

            removeProcessingOrder: (orderId: string) => {
                set((state) => ({
                    processingOrders: state.processingOrders.filter(
                        (order) => order.orderId !== orderId
                    ),
                }));
            },

            addCancelledOrdersId: (orderId: string) => {
                set((state) => ({
                    cancelledOrdersId: [...state.cancelledOrdersId, orderId],
                }));
            },

            removeCancelledOrdersId: (orderId: string) => {
                set((state) => ({
                    cancelledOrdersId: state.cancelledOrdersId.filter(
                        (id) => id !== orderId
                    ),
                }));
            },

            setIsPollingEnabled: (isPolling: boolean) => {
                set({ isPollingEnabled: isPolling });
            },

            clearCancelledOrdersId: () => {
                set({ cancelledOrdersId: [] });
            },

            addUpdatedOrders: (order: ProcessingUpdatedOrder) => {
                set((state) => {
                    const existingOrderIndex = state.updatedOrders.findIndex(
                        (existingOrder) => existingOrder.orderId === order.orderId
                    );

                    if (existingOrderIndex !== -1) {
                        const updatedOrders = [...state.updatedOrders];
                        updatedOrders[existingOrderIndex] = order;
                        return { updatedOrders };
                    }

                    return {
                        updatedOrders: [...state.updatedOrders, order],
                    };
                });
            },

            removeUpdatedOrders: (orderId: string) => {
                set((state) => ({
                    updatedOrders: state.updatedOrders.filter(
                        (order) => order.orderId !== orderId
                    ),
                }));
            },
        }),
        {
            name: 'processing-orders-storage',
            partialize: (state) => ({
                processingOrders: state.processingOrders,
                cancelledOrdersId: state.cancelledOrdersId,
                purchasedOrders: state.purchasedOrders,
                updatedOrders: state.updatedOrders,
            }),
        }
    )
);


