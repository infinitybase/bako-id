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

type TUpdateOrder = UpdateOrder & { orderId: string };

export const useUpdateOrder = () => {
  const marketplaceContract = useMarketplace();
  const { chainId } = useChainId();
  const { account } = useAccount();
  const { page: urlPage, search } = useSearch({ strict: false });

  const address = account?.toLowerCase();
  const page = Number(urlPage || 1);

  const {
    mutate: updateOrder,
    mutateAsync: updateOrderAsync,
    ...rest
  } = useMutationWithPolling<TUpdateOrder, unknown, PaginationResult<Order>>({
    mutationFn: async ({ orderId, ...data }: TUpdateOrder) => {
      const marketplace = await marketplaceContract;
      return await marketplace.updateOrder(orderId, data);
    },
    pollConfigs: [
      {
        getQueryKey: () => [
          MarketplaceQueryKeys.ORDERS,
          address,
          page,
          chainId,
        ],
        isDataReady: (data, payload) => {
          if (!data) {
            console.log('no data');
            return true;
          }

          const { orderId } = payload;
          const refreshedOrder = data.data.find(
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
    order.asset?.id === sellAsset &&
    order.itemPrice === sellPrice.toString()
  );
};
