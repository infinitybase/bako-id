import { setPrimaryHandle } from '@bako-id/sdk';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type * as fuels from 'fuels';

type SetPrimaryHandleParams = {
  domain: string;
  account: fuels.Account;
};

const useSetPrimaryHandleRequest = async (
  options?: UseMutationOptions<
    (params: SetPrimaryHandleParams) => Promise<{
      gasUsed: fuels.BN;
      transactionId: string;
      transactionResult: fuels.TransactionResult<fuels.TransactionType.Script>;
      transactionResponse: fuels.TransactionResponse;
    }>,
    unknown,
    SetPrimaryHandleParams
  >,
) => {
  return useMutation({
    mutationKey: ['setPrimaryHandle'],
    mutationFn: async () => await setPrimaryHandle,
    ...options,
  });
};

export { useSetPrimaryHandleRequest };
