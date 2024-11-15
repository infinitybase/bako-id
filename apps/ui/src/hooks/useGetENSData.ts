import { useQuery } from '@tanstack/react-query';
import { ensCheckRegister } from '../modules/ens/services';

const useGetENSData = (ensName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['get-ens', ensName],
    queryFn: async () => {
      try {
        const result = await ensCheckRegister(ensName);
        if (!result) {
          // Need to throw this error to activate the "retry" method.
          throw new Error('Expected null value. Activating Retry method');
        }
        return result;
      } catch (error) {
        console.log('Error while searching for ENS', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!ensName,
    retryDelay: (failureCount) => failureCount * 500,
  });

  return {
    data,
    ...rest,
  };
};

export { useGetENSData };
