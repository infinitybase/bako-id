import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { EditResolverParams, RegisterDomainResponse } from '../types';

const useEditResolverRequests = (
  options?: UseMutationOptions<
    RegisterDomainResponse,
    unknown,
    EditResolverParams
  >
) => {
  // TODO: Refactor
  return useMutation({
    mutationKey: ['editResolver'],
    mutationFn: async (_params: EditResolverParams) => {
      return {} as unknown as RegisterDomainResponse;
    },
    retryDelay: 1000,
    ...options,
  });
};

export { useEditResolverRequests };
