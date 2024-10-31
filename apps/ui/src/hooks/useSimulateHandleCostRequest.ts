import { type UseMutationOptions, useQuery } from '@tanstack/react-query';
import type { RegisterDomainPayload } from '../types';

const useSimulateHandleCostRequest = (
  domain: string,
  period: number,
  options?: UseMutationOptions<unknown, unknown, RegisterDomainPayload>
) => {
  return useQuery({
    queryKey: ['simulateHandleCost', period],
    queryFn: async () => null,
    enabled: !!domain && !!period,
    ...options,
  });
};

export { useSimulateHandleCostRequest };
