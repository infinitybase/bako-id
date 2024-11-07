import { RegistryContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Provider } from 'fuels';

export const useToken = () => {
  const { domain } = useParams({ strict: false });
  const { provider } = useProvider();

  const { data } = useQuery({
    queryKey: ['token', domain],
    queryFn: async () => {
      try {
        let registryContract: RegistryContract;

        if (provider) {
          registryContract = RegistryContract.create(provider);
        } else {
          const provider = await Provider.create(
            import.meta.env.VITE_PROVIDER_URL
          );
          registryContract = RegistryContract.create(provider);
        }

        return registryContract.token(domain);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    enabled: !!domain,
  });

  return {
    token: data,
  };
};
