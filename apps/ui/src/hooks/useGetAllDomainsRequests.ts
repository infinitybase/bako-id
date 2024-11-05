import { useQuery } from '@tanstack/react-query';

import { OffChainSync } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { ZeroBytes32 } from 'fuels';

const useGetAllDomainRequests = () => {
  // TODO: Refactor, get domains from indexer
  const { wallet } = useWallet();

  return useQuery({
    queryKey: ['getAllDomains', wallet?.address.toB256() ?? ZeroBytes32],
    queryFn: async () => {
      const sync = await OffChainSync.create(wallet!.provider);
      const walletAddress = wallet!.address.toB256();
      const records = sync.getRecords(walletAddress);

      return records;
    },
    enabled: !!wallet,
  });
};

export { useGetAllDomainRequests };
