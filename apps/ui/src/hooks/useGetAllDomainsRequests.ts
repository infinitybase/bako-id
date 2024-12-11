import { useQuery } from '@tanstack/react-query';

import { BakoIDClient } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { ZeroBytes32 } from 'fuels';

const useGetAllDomainRequests = () => {
  // TODO: Refactor, get domains from indexer
  const { wallet } = useWallet();

  return useQuery({
    queryKey: ['getAllDomains', wallet?.address.toB256() ?? ZeroBytes32],
    queryFn: async () => {
      const bakoIDClient = new BakoIDClient(import.meta.env.VITE_API_URL);
      return bakoIDClient.records(
        wallet!.address.toB256(),
        wallet!.provider.getChainId()
      );
    },
    enabled: !!wallet,
  });
};

export { useGetAllDomainRequests };
