import { register } from '@bako-id/sdk';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { RegisterDomainPayload, RegisterDomainResponse } from '../types';

const useRegisterDomainRequests = (
  options?: UseMutationOptions<
    RegisterDomainResponse,
    unknown,
    RegisterDomainPayload
  >,
) => {
  return useMutation({
    mutationKey: ['registerDomain'],
    mutationFn: register,
    ...options,
  });
};

export { useRegisterDomainRequests };
