import { type UseMutationOptions, useQuery } from '@tanstack/react-query';
import type { GracePeriodResponse, ProviderParams } from '../types';

const useGetGracePeriodRequest = (
  owner: string,
  _params?: ProviderParams,
  options?: UseMutationOptions<GracePeriodResponse, unknown, ProviderParams>
) => {
  // TODO: Refactor
  return useQuery({
    queryKey: ['registerDomain'],
    queryFn: () => ({
      timestamp: new Date(),
      period: new Date(),
      gracePeriod: new Date(),
    }),
    ...options,
    enabled: !!owner,
  });
};

export { useGetGracePeriodRequest };
