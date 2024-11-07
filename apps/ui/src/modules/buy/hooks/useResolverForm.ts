import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useWallet } from '@fuels/react';
import { useGetProviderRequest } from '../../../hooks/useGetProviderRequest';
import { isB256 } from 'fuels';
import { useQuery } from '@tanstack/react-query';

export type CustomAutocompleteValue = {
  resolver: string;
};

export const useResolverForm = () => {
  const { data: provider } = useGetProviderRequest();
  const { wallet } = useWallet();

  const [resolverAddress, setResolverAddress] = useState<string>(
    wallet?.address.toB256() ?? '',
  );

  const {
    data: isValid,
    refetch,
    isLoading: isResolverValidatingLoading,
    isFetching: isResolverValidatingFetching,
  } = useQuery({
    queryKey: ['validateResolver', provider, resolverAddress],
    queryFn: async () => {
      const type = await provider?.getAddressType(resolverAddress);
      return type ? Boolean(type === 'Account' || type === 'Contract') : false;
    },
    enabled: Boolean(provider && resolverAddress.length >= 66),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  });

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<CustomAutocompleteValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      resolver: '',
    },
  });

  const handleResolverAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setResolverAddress(value);

    if (
      isB256(value) &&
      !isResolverValidatingLoading &&
      !isResolverValidatingFetching
    ) {
      refetch();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (wallet?.address && resolverAddress.length === 0) {
      const address = wallet.address.toB256();
      setResolverAddress(address);
      setValue('resolver', address, { shouldValidate: true });
    }
  }, [wallet]);

  return {
    control,
    errors,
    isValid,
    handleResolverAddressChange,
    resolverAddress,
    wallet,
    isResolverValidatingLoading,
    isResolverValidatingFetching,
  };
};
