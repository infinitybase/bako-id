import { useQuery } from '@tanstack/react-query';
import { ensCheckRegister } from '@bako-id/sdk';

const useGetENSData = (ensName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['resolveDomain'],
    queryFn: async () => {
      try {
        return await ensCheckRegister(ensName);
      } catch (error) {
        console.log('error', error);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
  return {
    data,
    ...rest,
  };
};

export { useGetENSData };
