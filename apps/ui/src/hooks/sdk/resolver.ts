import { ResolverContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useMemo } from 'react';

export const useResolverContract = () => {
  const { provider } = useProvider();

  const providerQuery = useQuery({
    queryKey: ['resolverProvider'],
    queryFn: async () => {
      return provider || Provider.create(import.meta.env.VITE_PROVIDER_URL);
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !provider,
  });

  const contract = useMemo(() => {
    if (!providerQuery.data) return null;
    return ResolverContract.create(providerQuery.data);
  }, [providerQuery.data]);

  return contract;
};
