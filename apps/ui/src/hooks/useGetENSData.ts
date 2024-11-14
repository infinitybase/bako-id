import { useQuery } from '@tanstack/react-query';
import { ensCheckRegister } from '@bako-id/sdk';

const useGetENSData = (ensName: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['get-ens', ensName],
    queryFn: async () => {
      try {
        const result = await ensCheckRegister(ensName);
        if (!data && !result) {
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
    // The first request always return null, so i needed do this "trick" to do a retry evertytime. It just do the retry once.
    retry: (failureCount: number, error: unknown): boolean => {
      return failureCount === 0 && (data === null || !!error);
    },
    retryDelay: 500,
  });

  return {
    data,
    ...rest,
  };
};

export { useGetENSData };
