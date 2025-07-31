import { BakoIDQueryKeys } from '@/utils/constants';
import type { Order as OrderFromFuel } from '@bako-id/marketplace';
import { useAccount } from '@fuels/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore, type ProcessingOrder } from '@/modules/marketplace/stores/processingOrdersStore';

export const useCreateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { account } = useAccount();

  const address = account?.toLowerCase();
  const addProcessingOrders = useProcessingOrdersStore((state) => state.addProcessingOrders);

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (order: OrderFromFuel & { image: string }) => {
      const marketplace = await marketplaceContract;
      const { orderId } = await marketplace.createOrder(order);
      return { orderId, image: order.image, assetId: order.itemAsset };
    },

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
  });

  return { createOrder, createOrderAsync, ...rest };
};
