import { register } from '@bako-id/sdk';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { RegisterDomainPayload, RegisterDomainResponse } from '../types';

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
