import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProcessingOrder {
    orderId: string;
    image: string;
    assetId: string;
    timestamp: number;
}

interface ProcessingOrdersState {
    processingOrders: ProcessingOrder[];
    cancelledOrdersId: string[];
    isPollingEnabled: boolean;

    // Actions
    addProcessingOrders: (order: ProcessingOrder) => void;
    removeProcessingOrder: (orderId: string) => void;
    addCancelledOrdersId: (orderId: string) => void;
    removeCancelledOrdersId: (orderId: string) => void;
    setIsPollingEnabled: (isPolling: boolean) => void;
    clearCancelledOrdersId: () => void;
}


export const useProcessingOrdersStore = create<ProcessingOrdersState>()(
    persist(
        (set) => ({
            processingOrders: [],
            cancelledOrdersId: [],
            isPollingEnabled: false,

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
        }),
        {
            name: 'processing-orders-storage',
            partialize: (state) => ({
                processingOrders: state.processingOrders,
                cancelledOrdersId: state.cancelledOrdersId,
            }),
        }
    )
);

export type { ProcessingOrder }; 