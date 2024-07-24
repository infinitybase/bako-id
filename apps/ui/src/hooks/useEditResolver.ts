import { type Account, Address } from 'fuels';
import { useCustomToast } from '../components';
import { useProfile } from '../modules/profile/hooks/useProfile';
import { useEditResolverRequests } from './useEditResolverRequests';

interface EditResolverParams {
  domain: string;
  account: Account;
}

export const useEditResolver = ({ domain, account }: EditResolverParams) => {
  const { errorToast, successToast } = useCustomToast();
  const { domainMethods } = useProfile();
  const editResolver = useEditResolverRequests();

  const handleChangeResolver = (resolver: string) => {
    editResolver.mutate(
      {
        domain,
        resolver: Address.fromAddressOrString(resolver).toB256(),
        account,
      },
      {
        onError: (error: unknown) => {
          // @ts-expect-error error
          errorToast({ title: 'Error', description: error.message });
        },
        onSuccess: () => {
          successToast({ title: 'Success', description: 'Resolver updated' });
          domainMethods.refetch();
        },
      }
    );
  };

  return {
    editResolver,
    handleChangeResolver,
  };
};
