import { MarketplaceContract } from '@bako-id/marketplace';
import { useWallet } from '@fuels/react';
import { useMemo } from 'react';

export const useMarketplace = () => {
  const { wallet } = useWallet();

  const marketplace = useMemo(
    () => MarketplaceContract.create(wallet!),
    [wallet]
  );

  return marketplace;
};
