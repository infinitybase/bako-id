import { simulateHandleCost } from '@bako-id/sdk';

import { useQuery, type UseMutationOptions } from '@tanstack/react-query';
import type { Account } from 'fuels';
import type { RegisterDomainPayload } from '../types';

const useSimulateHandleCostRequest = (
  account: Account,
  resolver: string,
  domain: string,
  period: number,
  options?: UseMutationOptions<unknown, unknown, RegisterDomainPayload>,
) => {
  return useQuery({
    queryKey: ['simulateHandleCost', period],
    queryFn: () =>
      simulateHandleCost({
        account,
        resolver,
        domain,
        period,
      }),
    enabled: !!account && !!resolver && !!domain && !!period,
    ...options,
  });
};

export { useSimulateHandleCostRequest };
