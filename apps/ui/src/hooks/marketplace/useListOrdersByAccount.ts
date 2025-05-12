import BakoIdService from '@/services/bako-id';
import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import {
  getOrderMetadata,
  saveMetadataToLocalStorage,
} from '@/utils/getOrderMetadata';
import { getPagination } from '@/utils/pagination';
import { Networks } from '@/utils/resolverNetwork';
import { useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useChainId } from '../useChainId';

type useListOrdersProps = { account?: string; page?: number; limit?: number };

export const useListOrdersByAccount = ({
  account,
  page = 1,
  limit = 12,
}: useListOrdersProps) => {
  const { chainId } = useChainId();

  const { data: orders, ...rest } = useQuery({
    queryFn: async () => {
      const { orders, total } = await marketplaceService.getOrdersByAccount({
        account: account!,
        page,
        chainId: chainId ?? undefined,
      });

      const sellers = uniqBy(orders, (order) => order.seller).map(
        (order) => order.seller
      );

      const domains = await BakoIdService.names(
        sellers,
        chainId ?? Networks.MAINNET
      );

      const ordersWithMetadata = await Promise.all(
        orders.map(async (order) => getOrderMetadata(order, chainId))
      );

      saveMetadataToLocalStorage(ordersWithMetadata);

      const ordersWithDomain = ordersWithMetadata.map((order) => ({
        ...order,
        sellerDomain: domains.names.find(
          (domain) => domain.resolver === order.seller
        )?.name,
      }));

      return getPagination({
        data: ordersWithDomain,
        page,
        limit,
        total,
      });
    },
    queryKey: [MarketplaceQueryKeys.ORDERS, account, page, chainId],
    placeholderData: (data) => data,
    enabled: !!account,
  });

  return { orders, ...rest };
};
