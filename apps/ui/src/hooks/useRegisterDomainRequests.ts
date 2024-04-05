import { simulateHandleCost } from '@bako-id/sdk';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { RegisterDomainPayload } from '../types';

const useRegisterDomainRequests = (
  options?: UseMutationOptions<unknown, unknown, RegisterDomainPayload>,
) => {
  return useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: simulateHandleCost,
    ...options,
  });
};

export { useRegisterDomainRequests };
