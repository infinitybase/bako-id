import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';

export const useGetProviderRequest = () => {
  const { provider } = useProvider();

  const { data, ...rest } = useQuery({
    queryKey: ['uniqueProvider', provider],
    queryFn: async () => {
      if (provider) return provider;
      return Provider.create(import.meta.env.VITE_PROVIDER_URL);
    },
  });

  return {
    data,
    ...rest,
  };
};
