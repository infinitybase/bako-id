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
  addCancelledOrdersId: (orderId: string) => void;
  removeCancelledOrdersId: (orderId: string) => void;
  cancelledOrdersId: string[];
  isPollingEnabled: boolean;
  setIsPollingEnabled: (isPolling: boolean) => void;
  clearCancelledOrdersId: () => void;
}

const ProcessingOrdersContext = createContext<
  ProcessingOrdersContextType | undefined
>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    }
    return initialValue;
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue =
        typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      return newValue;
    });
  };

  return [state, setValue] as const;
};

export const ProcessingOrdersProvider = ({
  children,
}: { children: ReactNode }) => {
  const [processingOrders, setProcessingOrders] = useLocalStorage<
    ProcessingOrder[]
  >('processingOrders', []);
  const [cancelledOrdersId, setCancelledOrdersId] = useLocalStorage<string[]>(
    'cancelledOrdersId',
    []
  );
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);

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
    setProcessingOrders((prev) =>
      prev.filter((order) => order.orderId !== orderId)
    );
  };

  const clearCancelledOrdersId = () => {
    setCancelledOrdersId([]);
  };

  const value: ProcessingOrdersContextType = {
    processingOrders,
    addProcessingOrders,
    removeProcessingOrder,
    addCancelledOrdersId,
    removeCancelledOrdersId,
    cancelledOrdersId,
    isPollingEnabled,
    setIsPollingEnabled,
    clearCancelledOrdersId,
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
