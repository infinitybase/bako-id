import { editResolver } from '@bako-id/sdk';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { Account } from 'fuels';
import type { EditResolverParams, RegisterDomainResponse } from '../types';

const useEditResolverRequests = (
  domain: string,
  resolver: string,
  account: Account,
  options?: UseMutationOptions<
    RegisterDomainResponse,
    unknown,
    EditResolverParams
  >,
) => {
  return useMutation({
    mutationKey: ['resolveDomain'],
    mutationFn: () => editResolver({ domain, resolver, account }),
    retryDelay: 1000,
    ...options,
  });
};

export { useEditResolverRequests };
