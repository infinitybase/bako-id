import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProcessingOrder {
    owner: string;
    orderId: string;
    image: string;
    assetId: string;
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
    cancelledOrders: { orderId: string, owner: string }[];
    purchasedOrders: string[];
    updatedOrders: ProcessingUpdatedOrder[];
    isPollingEnabled: boolean;

    // Actions
    addProcessingOrders: (order: ProcessingOrder) => void;
    removeProcessingOrder: (orderId: string) => void;
    addCancelledOrders: (orderId: string, owner: string) => void;
    removeCancelledOrders: (orderId: string) => void;
    setIsPollingEnabled: (isPolling: boolean) => void;
    clearCancelledOrders: () => void;
    addPurchasedOrder: (orderId: string) => void;
    removePurchasedOrder: (orderId: string) => void;
    addUpdatedOrders: (order: ProcessingUpdatedOrder) => void;
    removeUpdatedOrders: (orderId: string) => void;
}

export const useProcessingOrdersStore = create<ProcessingOrdersState>()(
    persist(
        (set) => ({
            processingOrders: [],
            cancelledOrders: [],
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

            addCancelledOrders: (orderId: string, owner: string) => {
                set((state) => ({
                    cancelledOrders: [...state.cancelledOrders, { orderId, owner }],
                }));
            },

            removeCancelledOrders: (orderId: string) => {
                set((state) => ({
                    cancelledOrders: state.cancelledOrders.filter(
                        (order) => order.orderId !== orderId
                    ),
                }));
            },

            setIsPollingEnabled: (isPolling: boolean) => {
                set({ isPollingEnabled: isPolling });
            },

            clearCancelledOrders: () => {
                set({ cancelledOrders: [] });
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
            name: '@garage-optimistic',
            partialize: (state) => ({
                processingOrders: state.processingOrders,
                cancelledOrders: state.cancelledOrders,
                purchasedOrders: state.purchasedOrders,
                updatedOrders: state.updatedOrders,
            }),
        }
    )
);


