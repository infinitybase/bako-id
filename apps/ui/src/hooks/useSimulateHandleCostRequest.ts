import { simulateHandleCost } from '@bako-id/sdk';

import { useQuery, type UseMutationOptions } from '@tanstack/react-query';
import type { Account } from 'fuels';
import type { RegisterDomainPayload } from '../types';

const useSimulateHandleCostRequest = (
  account: Account,
  resolver: string,
  domain: string,
  options?: UseMutationOptions<unknown, unknown, RegisterDomainPayload>,
) => {
  return useQuery({
    queryKey: ['simulateHandleCost'],
    queryFn: () =>
      simulateHandleCost({
        account,
        resolver,
        domain,
      }),
    enabled: !!account && !!resolver && !!domain,
    ...options,
  });
};

export { useSimulateHandleCostRequest };
