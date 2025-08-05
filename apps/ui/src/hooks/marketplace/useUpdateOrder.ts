import type { UpdateOrder } from '@bako-id/marketplace';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAccount, useChainId } from '@fuels/react';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { marketplaceService } from '@/services/marketplace';

type TUpdateOrder = UpdateOrder & {
  orderId: string;
  oldPrice: { oldAmount: number; oldRaw: string };
  newPrice: { newAmount: number; newRaw: string; usd: number };
};

export const useUpdateOrder = () => {
  const marketplaceContract = useMarketplace();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();
  const { addUpdatedOrders } = useProcessingOrdersStore();

  const address = account?.toLowerCase();

  const {
    mutate: updateOrder,
    mutateAsync: updateOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async ({
      orderId,
      oldPrice,
      newPrice,
      ...data
    }: TUpdateOrder) => {
      const marketplace = await marketplaceContract;
      const { transactionResult } = await marketplace.updateOrder(orderId, data);
      return { orderId, oldPrice, newPrice, data, txId: transactionResult.id };
    },
    onSuccess: async ({ orderId, oldPrice, newPrice, txId }) => {
      addUpdatedOrders({
        orderId,
        oldAmount: oldPrice.oldAmount,
        oldRaw: oldPrice.oldRaw,
        newAmount: newPrice.newAmount,
        newRaw: newPrice.newRaw,
        usd: newPrice.usd,
        txId,
      });
      queryClient.invalidateQueries({
        queryKey: [MarketplaceQueryKeys.USER_ORDERS, address],
      });
      await marketplaceService.saveReceipt({
        txId,
        chainId: chainId ?? Networks.MAINNET,
      });
    },
  });

  return { updateOrder, updateOrderAsync, ...rest };
};

