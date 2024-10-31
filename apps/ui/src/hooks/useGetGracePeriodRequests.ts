import { getGracePeriod } from '@bako-id/sdk';
import { useQuery, type UseMutationOptions } from '@tanstack/react-query';
import type { GracePeriodResponse, ProviderParams } from '../types';

const useGetGracePeriodRequest = (
  owner: string,
  params?: ProviderParams,
  options?: UseMutationOptions<GracePeriodResponse, unknown, ProviderParams>,
) => {
  return useQuery({
    queryKey: ['registerDomain'],
    queryFn: () =>
      getGracePeriod(owner, {
        account: params?.account,
        provider: params?.provider,
        providerURL: params?.providerURL,
      }),
    ...options,
    enabled: !!owner,
  });
};

export { useGetGracePeriodRequest };
