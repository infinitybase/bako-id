import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProcessingOrder {
    owner: string;
    orderId: string;
    image: string;
    assetId: string;
    txId: string;
}

export type CancelledOrder = {
    orderId: string;
    owner: string;
    txId: string;
}

export interface ProcessingUpdatedOrder {
    orderId: string;
    oldAmount: number;
    oldRaw: string;
    newAmount: number;
    newRaw: string;
    usd: number;
    txId: string;
    assetIcon: string
}


interface ProcessingOrdersState {
    processingOrders: ProcessingOrder[];
    cancelledOrders: CancelledOrder[];
    purchasedOrders: { orderId: string, txId: string }[];
    updatedOrders: ProcessingUpdatedOrder[];

    // Actions
    addProcessingOrders: (order: ProcessingOrder) => void;
    removeProcessingOrder: (orderId: string) => void;
    addCancelledOrders: (order: CancelledOrder) => void;
    removeCancelledOrders: (orderId: string) => void;
    clearCancelledOrders: () => void;
    addPurchasedOrder: (orderId: string, txId: string) => void;
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

            addPurchasedOrder: (orderId: string, txId: string) => {
                set((state) => ({
                    purchasedOrders: [...state.purchasedOrders, { orderId, txId }],
                }));
            },

            removePurchasedOrder: (orderId: string) => {
                set((state) => ({
                    purchasedOrders: state.purchasedOrders.filter(
                        (currentOrder) => currentOrder.orderId !== orderId
                    ),
                }));
            },

            addProcessingOrders: (order: ProcessingOrder) => {
                set((state) => {
                    const filteredUpdatedOrders = state.updatedOrders.filter(
                        (updatedOrder) => updatedOrder.orderId !== order.orderId
                    );

                    const filteredCancelledOrders = state.cancelledOrders.filter(
                        (cancelledOrder) => cancelledOrder.orderId !== order.orderId
                    );

                    return {
                        processingOrders: [...state.processingOrders, order],
                        updatedOrders: filteredUpdatedOrders,
                        cancelledOrders: filteredCancelledOrders,
                    };
                });
            },

            removeProcessingOrder: (orderId: string) => {
                set((state) => ({
                    processingOrders: state.processingOrders.filter(
                        (order) => order.orderId !== orderId
                    ),
                }));
            },

            addCancelledOrders: (order: CancelledOrder) => {
                set((state) => {

                    const filteredProcessingOrders = state.processingOrders.filter(
                        (processingOrder) => processingOrder.orderId !== order.orderId
                    );

                    const filteredUpdatedOrders = state.updatedOrders.filter(
                        (updatedOrder) => updatedOrder.orderId !== order.orderId
                    );

                    return {
                        processingOrders: filteredProcessingOrders,
                        updatedOrders: filteredUpdatedOrders,
                        cancelledOrders: [...state.cancelledOrders, order],
                    };
                });
            },

            removeCancelledOrders: (orderId: string) => {
                set((state) => ({
                    cancelledOrders: state.cancelledOrders.filter(
                        (order) => order.orderId !== orderId
                    ),
                }));
            },

            clearCancelledOrders: () => {
                set({ cancelledOrders: [] });
            },

            addUpdatedOrders: (order: ProcessingUpdatedOrder) => {
                set((state) => {

                    const filteredProcessingOrders = state.processingOrders.filter(
                        (processingOrder) => processingOrder.orderId !== order.orderId
                    );

                    const filteredCancelledOrders = state.cancelledOrders.filter(
                        (cancelledOrder) => cancelledOrder.orderId !== order.orderId
                    );

                    const existingOrderIndex = state.updatedOrders.findIndex(
                        (existingOrder) => existingOrder.orderId === order.orderId
                    );

                    if (existingOrderIndex !== -1) {
                        const updatedOrders = [...state.updatedOrders];
                        updatedOrders[existingOrderIndex] = order;
                        return {
                            updatedOrders,
                            processingOrders: filteredProcessingOrders,
                            cancelledOrders: filteredCancelledOrders,
                        };
                    }

                    return {
                        updatedOrders: [...state.updatedOrders, order],
                        processingOrders: filteredProcessingOrders,
                        cancelledOrders: filteredCancelledOrders,
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


