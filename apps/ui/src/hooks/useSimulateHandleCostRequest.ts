import { simulateHandleCost } from '@bako-id/sdk';

import { useQuery, type UseMutationOptions } from '@tanstack/react-query';
import type { RegisterDomainPayload } from '../types';

const useSimulateHandleCostRequest = (
  domain: string,
  period: number,
  options?: UseMutationOptions<unknown, unknown, RegisterDomainPayload>,
) => {
  return useQuery({
    queryKey: ['simulateHandleCost', period],
    queryFn: async () =>
      await simulateHandleCost({
        domain,
        period,
      }),
    enabled: !!domain && !!period,
    ...options,
  });
};

export { useSimulateHandleCostRequest };
