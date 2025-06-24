import type { Asset } from '@/types/marketplace';
import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';

export const useAssetsBalance = ({ assets }: { assets: Asset[] }) => {
  const { wallet, isFetched } = useWallet();

  const { data, isLoading, ...rest } = useQuery({
    queryKey: ['balances', isFetched, assets],
    queryFn: async () => {
      if (wallet) {
        const { balances } = await wallet.getBalances();

        return assets.map((asset) => {
          const balance = balances.find(
            (balance) => balance.assetId === asset.id
          );
          return {
            ...asset,
            balance: balance ? bn(balance.amount) : bn(0),
          };
        });
      }
    },
    enabled: !!wallet && isFetched,
  });

  return { data, isLoading, ...rest };
};
