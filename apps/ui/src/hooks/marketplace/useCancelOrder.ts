import { BakoIDQueryKeys, MarketplaceQueryKeys } from '@/utils/constants';
import { useAccount } from '@fuels/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useChainId } from '../useChainId';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';

export const useCancelOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();

  const { addCancelledOrdersId } = useProcessingOrdersStore();

  const address = account?.toLowerCase();

  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      await marketplace.cancelOrder(orderId);
      return orderId;
    },

    onSuccess: async (cancelledOrderid) => {
      addCancelledOrdersId(cancelledOrderid);
      await queryClient.invalidateQueries({
        queryKey: [BakoIDQueryKeys.NFTS, chainId, address],
      });

      await queryClient.invalidateQueries({
        queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
      });
    },
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
