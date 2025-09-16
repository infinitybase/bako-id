import { useMarketplace } from './useMarketplace';
import { useQuery } from '@tanstack/react-query';
import type { MarketplaceAction } from '@bako-id/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';

export const useGetTransactionCost = (
  orderId: string,
  actionToSimulate: MarketplaceAction,
  enabled: boolean
) => {
  const marketplaceContract = useMarketplace();


  const { data, isFetching, error } = useQuery({
    queryKey: [
      MarketplaceQueryKeys.TRANSACTION_COST,
      orderId,
      actionToSimulate,
    ],
    queryFn: async () => {
      const marketplace = await marketplaceContract;

      const { fee } = await marketplace.simulate(orderId, actionToSimulate);

      return {
        fee,
      };
    },
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Cache data for 5 minutes to avoid refetching whenever users hover the card
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data,
    isLoading: isFetching,
    error,
  };
};
