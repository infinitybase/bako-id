import { useQuery } from '@tanstack/react-query';

import { BakoIDClient, RegistryContract } from '@bako-id/sdk';
import { useGetProviderRequest } from './useGetProviderRequest';

const useGetGracePeriod = (domain: string) => {
  const { data: provider } = useGetProviderRequest();
  const { data: dates, ...rest } = useQuery({
    queryKey: ['getDates', domain],
    queryFn: async () => {
      let registryContract: RegistryContract;
      if (provider) {
        const client = new BakoIDClient(provider, import.meta.env.VITE_API_URL);
        registryContract = RegistryContract.create(provider, client);

        const { ttl, timestamp } = await registryContract.getDates(domain);
        const gracePeriod = new Date(ttl);
        gracePeriod.setDate(gracePeriod.getDate() + 90);

        return { ttl, timestamp, gracePeriod };
      }
    },
    enabled: !!domain && !!provider,
  });

  return {
    dates,
    ...rest,
  };
};

export { useGetGracePeriod };
