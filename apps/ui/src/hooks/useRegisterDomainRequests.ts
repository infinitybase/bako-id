import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { RegisterDomainPayload, RegisterDomainResponse } from '../types';

const useRegisterDomainRequests = (
  options?: UseMutationOptions<
    RegisterDomainResponse,
    unknown,
    RegisterDomainPayload
  >
) => {
  return useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: async (_payload: RegisterDomainPayload) => {
      return null as unknown as RegisterDomainResponse;
    },
    ...options,
  });
};

export { useRegisterDomainRequests };
