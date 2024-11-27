import { useMutation } from '@tanstack/react-query';
import { type Account, Address } from 'fuels';
import { useCustomToast } from '../components';
import { useProfile } from '../modules/profile/hooks/useProfile';
import { useRegistryContract } from './sdk';
import { useMutationProgress } from './useMutationProgress.ts';

interface EditResolverParams {
  domain: string;
  account: Account;
}

export const useEditResolver = ({ domain }: EditResolverParams) => {
  const { errorToast, successToast } = useCustomToast();
  const { domainMethods } = useProfile();

  const registryContract = useRegistryContract();
  const editResolver = useMutation({
    mutationKey: ['editResolver'],
    mutationFn: async (params: { domain: string; address: string }) => {
      if (!registryContract) return null;
      return registryContract.changeResolver({
        domain: params.domain,
        address: params.address,
      });
    },
    retryDelay: 1000,
  });
  const mutationProgress = useMutationProgress(editResolver);

  const handleChangeResolver = async (resolver: string) => {
    await editResolver.mutateAsync(
      {
        domain,
        address: Address.fromAddressOrString(resolver).toString(),
      },
      {
        onError: (error) => {
          let description = 'An error occurred while updating the resolver';
          if (error?.message.match(/ResolverAlreadyInUse/)) {
            description = 'The resolver address is already in use';
          }
          errorToast({
            title: 'Transaction error',
            description,
          });
        },
        onSuccess: () => {
          successToast({
            title: 'Transaction success',
            description: 'The resolver of the handle has been updated',
          });
          domainMethods.refetch();
        },
      }
    );
  };

  return {
    editResolver,
    mutationProgress,
    handleChangeResolver,
  };
};
