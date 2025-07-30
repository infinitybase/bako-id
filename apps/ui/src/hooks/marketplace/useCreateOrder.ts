import type { Order } from '@/types/marketplace';
import { BakoIDQueryKeys, MarketplaceQueryKeys } from '@/utils/constants';
import type { Order as OrderFromFuel } from '@bako-id/marketplace';
import { useAccount } from '@fuels/react';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { useMutationWithPolling } from '../useMutationWithPolling';
import type { PaginationResult } from '@/utils/pagination';
import { useProcessingOrders, type ProcessingOrder } from '@/contexts/ProcessingOrdersContext';

export const useCreateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { account } = useAccount();

  const address = account?.toLowerCase();
  const { addProcessingOrders, removeProcessingOrder } = useProcessingOrders();

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutationWithPolling({
    mutationFn: async (order: OrderFromFuel & { image: string }) => {
      const marketplace = await marketplaceContract;
      const { orderId } = await marketplace.createOrder(order);
      return { orderId, image: order.image, assetId: order.itemAsset };
    },
    mutationOpts: {
      onSuccess: async (orderResult) => {
        queryClient.invalidateQueries({
          queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
        });

        const newProcessingOrder: ProcessingOrder = {
          orderId: orderResult.orderId,
          image: orderResult.image,
          assetId: orderResult.assetId,
          timestamp: Date.now(),
        };

        addProcessingOrders(newProcessingOrder);
      },
    },
    pollConfigs: [
      {
        getQueryKey: () => [MarketplaceQueryKeys.USER_ORDERS, address],
        isDataReady: (
          data: InfiniteData<PaginationResult<Order>> | undefined,
          _,
          { orderId }
        ) => {
          if (!data) return true;

          const order = data.pages[0].data.find(
            (order) => order.id === orderId
          );

          const isReady = !!order;
          if (isReady) {
            removeProcessingOrder(orderId);
          }
          return isReady;
        },
      },
    ],
  });

  return { createOrder, createOrderAsync, ...rest };
};
