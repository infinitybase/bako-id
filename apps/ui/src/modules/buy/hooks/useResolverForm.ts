import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { isB256 } from 'fuels';
import { useGetProviderRequest } from '../../../hooks/useGetProviderRequest';

export type CustomAutocompleteValue = {
  resolver: string;
};

export const useResolverForm = () => {
  const { data: provider } = useGetProviderRequest();
  const { wallet } = useWallet();
  const [isFirstLoadingValidation, setIsFirstLoadingValidation] =
    useState(true);

  const [resolverAddress, setResolverAddress] = useState<string>('');

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

  const {
    data: isValid,
    refetch,
    isLoading: isResolverValidatingLoading,
    isFetching: isResolverValidatingFetching,
  } = useQuery({
    queryKey: ['validateResolver', resolverAddress],
    queryFn: async () => {
      const type = await provider?.getAddressType(resolverAddress);

      isFirstLoadingValidation && setIsFirstLoadingValidation(false);

      return type ? Boolean(type === 'Account' || type === 'Contract') : false;
    },
    enabled: Boolean(provider && resolverAddress.length >= 66),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  });

  const handleResolverAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
    if (provider && wallet && !resolverAddress) {
      const address = wallet.address.toB256();
      setResolverAddress(address);
      setValue('resolver', address, { shouldValidate: true });
    }
  }, [wallet, provider, resolverAddress]);

  return {
    control,
    errors,
    isValid,
    handleResolverAddressChange,
    resolverAddress,
    wallet,
    isResolverValidatingLoading,
    isResolverValidatingFetching,
    isFirstLoadingValidation,
  };
};
