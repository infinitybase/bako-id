import type { Account } from 'fuels';
import { useCustomToast } from '../components';
import { useEditResolverRequests } from './useEditResolverRequests';

interface EditResolverParams {
  domain: string;
  resolver: string;
  account: Account;
}

export const useEditResolver = ({
  domain,
  resolver,
  account,
}: EditResolverParams) => {
  const { errorToast } = useCustomToast();
  const editResolver = useEditResolverRequests(domain, resolver, account);

  const handleChangeResolver = (resolver: string) => {
    editResolver.mutate(
      { domain, resolver, account },
      {
        onError: (error: unknown) => {
          // @ts-expect-error error
          console.log({ ...error });
          // @ts-expect-error error
          errorToast(error.message);
        },
      },
    );
  };

  return {
    editResolver,
    handleChangeResolver,
  };
};
