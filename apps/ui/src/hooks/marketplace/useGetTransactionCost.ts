import { useMarketplace } from './useMarketplace';
import { useQuery } from '@tanstack/react-query';
import type { MarketplaceAction } from '@bako-id/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';

export const useGetTransactionCost = (
  orderId: string,
  actionToSimulate: MarketplaceAction
) => {
  const marketplaceContract = useMarketplace();

  const { data, isLoading, error } = useQuery({
    queryKey: [MarketplaceQueryKeys.TRANSACTION_COST, orderId, actionToSimulate],
    queryFn: async () => {
      const marketplace = await marketplaceContract;

      const { fee } = await marketplace.simulate(orderId, actionToSimulate);

      console.log('fee', fee.toString());

      return {
        fee,
      };
    },
  });

  return {
    data,
    isLoading,
    error,
  };
};
