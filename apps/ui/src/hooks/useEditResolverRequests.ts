import { editResolver } from '@bako-id/sdk';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { EditResolverParams, RegisterDomainResponse } from '../types';

const useEditResolverRequests = (
  options?: UseMutationOptions<
    RegisterDomainResponse,
    unknown,
    EditResolverParams
  >,
) => {
  return useMutation({
    mutationKey: ['editResolver'],
    mutationFn: editResolver,
    retryDelay: 1000,
    ...options,
  });
};

export { useEditResolverRequests };
