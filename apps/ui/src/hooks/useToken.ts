import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useRegistryContract } from './sdk';

export const useToken = () => {
  const { domain } = useParams({ strict: false });
  const registryContract = useRegistryContract();

  const { data } = useQuery({
    queryKey: ['token', domain],
    queryFn: async () => registryContract?.token(domain),
    enabled: !!domain,
  });

  return {
    token: data,
  };
};
