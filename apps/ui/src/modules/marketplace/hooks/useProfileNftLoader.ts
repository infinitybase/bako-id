import type { OrdersList } from '@/types/marketplace';
import type { NFTCollection } from '@/utils/collection';
import { useLayoutEffect, useState } from 'react';

type UseProfileNftLoaderProps = {
  isLoadingCollections: boolean;
  isPlaceholderData: boolean;
  notListedCollections: NFTCollection[];
  isLoadingOrders: boolean;
  data: OrdersList[];
};

export const useProfileNftLoader = ({
  isLoadingCollections,
  notListedCollections,
  data,
  isLoadingOrders,
  isPlaceholderData,
}: UseProfileNftLoaderProps) => {
  const [startCollectionsLoading, setStartCollectionsLoading] = useState(true);
  const [startOrdersLoading, setStartOrdersLoading] = useState(true);
  const [isEmptyCollections, setIsEmptyCollections] = useState(false);
  const [isEmptyOrders, setIsEmptyOrders] = useState(false);

  // The loading state here is a bit tricky because we rely on the wallet to initiate our requests. So, our isLoading state always starts as false,
  // turn into true and then false again.
  useLayoutEffect(() => {
    if (!isLoadingCollections && !isPlaceholderData) {
      setStartCollectionsLoading(false);
      setIsEmptyCollections(notListedCollections.length === 0);
    }
    if (!isLoadingOrders) {
      setStartOrdersLoading(false);
      setIsEmptyOrders(data.length === 0);
    }
  }, [
    isLoadingOrders,
    isPlaceholderData,
    isLoadingCollections,
    notListedCollections,
    data,
  ]);

  return {
    startCollectionsLoading,
    startOrdersLoading,
    isEmptyCollections,
    isEmptyOrders,
  };
};
