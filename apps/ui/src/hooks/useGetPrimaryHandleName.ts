import { useQuery } from '@tanstack/react-query';

import { BakoIDClient } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { ZeroBytes32 } from 'fuels';

const useGetPrimaryHandleName = () => {
  // TODO: Refactor, get domains from indexer
  const { wallet } = useWallet();

  return useQuery({
    queryKey: ['getPrimaryHandle', wallet?.address.toB256() ?? ZeroBytes32],
    queryFn: async () => {
      const chainId = await wallet!.provider.getChainId();
      const bakoIDClient = new BakoIDClient(import.meta.env.VITE_API_URL);
      return bakoIDClient.name(wallet!.address.toB256(), chainId);
    },
    enabled: !!wallet,
  });
};

export { useGetPrimaryHandleName };
