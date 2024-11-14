import { useQuery } from '@tanstack/react-query';
import { ensCheckRegister } from '@bako-id/sdk';

const useGetENSData = (ensName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['resolveDomain'],
    queryFn: async () => {
      try {
        const result = await ensCheckRegister(ensName);
        return result;
      } catch (error) {
        console.log('Error while searching for ENS', error);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!ensName,
  });

  return {
    data,
    ...rest,
  };
};
// vitalik.eth

export { useGetENSData };
