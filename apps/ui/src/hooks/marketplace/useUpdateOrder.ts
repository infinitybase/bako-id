import type { Order } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import type { PaginationResult } from '@/utils/pagination';
import type { UpdateOrder } from '@bako-id/marketplace';
import type { InfiniteData } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { useAccount } from '@fuels/react';
import { useChainId } from '../useChainId';
import { useMutationWithPolling } from '../useMutationWithPolling';
import { useMarketplace } from './useMarketplace';
import { useProcessingOrdersStore } from '@/modules/marketplace/stores/processingOrdersStore';

type TUpdateOrder = UpdateOrder & { orderId: string, oldPrice: { oldAmount: number, oldRaw: string }, newPrice: { newAmount: number, newRaw: string, usd: number } };

const removeRightZeros = (str: string) => {
  return str.replace(/0+$/, '');
};

export const useUpdateOrder = () => {
  const marketplaceContract = useMarketplace();
  const { chainId } = useChainId();
  const { account } = useAccount();
  const { search } = useSearch({ strict: false });
  const { addUpdatedOrders } = useProcessingOrdersStore();

  const address = account?.toLowerCase();

  const {
    mutate: updateOrder,
    mutateAsync: updateOrderAsync,
    ...rest
  } = useMutationWithPolling<
    TUpdateOrder,
    unknown,
    InfiniteData<PaginationResult<Order>, unknown>
  >({
    mutationFn: async ({ orderId, oldPrice, newPrice, ...data }: TUpdateOrder) => {
      const marketplace = await marketplaceContract;

      await marketplace.updateOrder(orderId, data);
      return { orderId, oldPrice, newPrice, data };
    },
    mutationOpts: {
      onSuccess: (_, { orderId, oldPrice, newPrice }) => {
        addUpdatedOrders({
          orderId: orderId,
          oldAmount: oldPrice.oldAmount,
          oldRaw: oldPrice.oldRaw,
          newAmount: newPrice.newAmount,
          newRaw: newPrice.newRaw,
          usd: newPrice.usd,
        });

      },
    },

    pollConfigs: [
      {
        getQueryKey: () => [MarketplaceQueryKeys.USER_ORDERS, address],
        isDataReady: (data, payload) => {
          if (!data) return true;

          const { orderId } = payload;
          const refreshedOrder = data.pages[0].data.find(
            (order) => order.id === orderId
          );

          return isEqual(refreshedOrder!, payload);
        },
      },
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ALL_ORDERS,
          chainId,
          search || '', // -> search
        ],
        // @ts-expect-error - TODO: fix this type error
        isDataReady: (
          data: InfiniteData<PaginationResult<Order>, unknown>,
          payload
        ) => {
          if (!data) return true;

          const { orderId } = payload;
          const orders = data.pages.flatMap((page) => page.data);
          const refreshedOrder = orders.find((order) => order.id === orderId);

          return isEqual(refreshedOrder!, payload);
        },
      },
    ],
  });

  return { updateOrder, updateOrderAsync, ...rest };
};

const isEqual = (order: Order, payload: TUpdateOrder) => {
  const { orderId, sellAsset, sellPrice } = payload;

  return (
    order.id === orderId &&
    order.price.assetId === sellAsset &&
    order.price.amount.toString() === removeRightZeros(sellPrice.toString())
  );
};
