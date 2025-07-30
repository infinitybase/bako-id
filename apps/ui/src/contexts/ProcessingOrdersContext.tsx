import { createContext, useContext, useState, type ReactNode } from 'react';

interface ProcessingOrder {
  orderId: string;
  image: string;
  assetId: string;
  timestamp: number;
}

interface ProcessingOrdersContextType {
  processingOrders: ProcessingOrder[];
  addProcessingOrders: (order: ProcessingOrder) => void;
  removeProcessingOrder: (orderId: string) => void;
  clearProcessingOrders: () => void;
  addCancelledOrdersId: (orderId: string) => void;
  removeCancelledOrdersId: (orderId: string) => void;
  cancelledOrdersId: string[];
}

const ProcessingOrdersContext = createContext<
  ProcessingOrdersContextType | undefined
>(undefined);

export const ProcessingOrdersProvider = ({
  children,
}: { children: ReactNode }) => {
  const [processingOrders, setProcessingOrders] = useState<ProcessingOrder[]>(
    []
  );

  const [cancelledOrdersId, setCancelledOrdersId] = useState<string[]>([]);

  const addProcessingOrders = (order: ProcessingOrder) => {
    setProcessingOrders((prev) => [...prev, order]);
  };

  const addCancelledOrdersId = (orderId: string) => {
    setCancelledOrdersId((prev) => [...prev, orderId]);
  };

  const removeCancelledOrdersId = (orderId: string) => {
    setCancelledOrdersId((prev) => prev.filter((id) => id !== orderId));
  };

  const removeProcessingOrder = (orderId: string) => {
    setProcessingOrders((prev) => {
      return prev.filter((order) => order.orderId !== orderId);
    });
  };

  const clearProcessingOrders = () => {
    setProcessingOrders([]);
  };

  const value: ProcessingOrdersContextType = {
    processingOrders,
    addProcessingOrders,
    removeProcessingOrder,
    clearProcessingOrders,
    addCancelledOrdersId,
    removeCancelledOrdersId,
    cancelledOrdersId,
  };

  return (
    <ProcessingOrdersContext.Provider value={value}>
      {children}
    </ProcessingOrdersContext.Provider>
  );
};

export const useProcessingOrders = () => {
  const context = useContext(ProcessingOrdersContext);
  if (context === undefined) {
    throw new Error(
      'useProcessingOrders must be used within a ProcessingOrdersProvider'
    );
  }
  return context;
};

export type { ProcessingOrder, ProcessingOrdersContextType };
