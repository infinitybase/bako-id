import { ResolverContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useMemo } from 'react';

const { VITE_PROVIDER_URL } = import.meta.env;

export const useResolverContract = () => {
  const { provider } = useProvider();

  const providerQuery = useQuery({
    queryKey: ['resolverProvider', provider?.url ?? VITE_PROVIDER_URL],
    queryFn: async () => {
      return provider || Provider.create(VITE_PROVIDER_URL);
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  const contract = useMemo(() => {
    if (!providerQuery.data) return null;
    return ResolverContract.create(providerQuery.data);
  }, [providerQuery.data]);

  return contract;
};
