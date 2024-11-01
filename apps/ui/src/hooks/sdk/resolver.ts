import { ResolverContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useMemo } from 'react';

export const useResolverContract = () => {
  const { provider } = useProvider();

  const providerQuery = useQuery({
    queryKey: ['resolverProvider', provider],
    queryFn: async () => {
      if (provider) return provider;
      return Provider.create(import.meta.env.VITE_PROVIDER_URL);
    },
  });

  const contract = useMemo(() => {
    console.log('provider', providerQuery.data);
    if (!providerQuery.data) return null;
    return ResolverContract.create(providerQuery.data);
  }, [providerQuery.data]);

  return contract;
};
