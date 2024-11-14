import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useGetENSData } from '../../../hooks';

export type CustomAutocompleteValue = {
  ens: string;
};

export const useENSForm = () => {
  const [ensName, setEnsName] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const { control, setValue } = useForm<CustomAutocompleteValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      ens: '',
    },
  });

  const { data, isLoading, isFetching, refetch } = useGetENSData(ensName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    value.length === 0 && setEnsName('');

    if (value.length >= 3) {
      if (value.endsWith('.eth') || value.endsWith('.box')) {
        setTimeout(() => {
          setEnsName(value);
          setValue('ens', value);
          refetch();
        }, 500);
      }
    }
  };

  return {
    control,
    handleInputChange,
    ensData: ensName ? data : null,
    isLoading: isLoading || isFetching,
    inputValue,
    ensName,
    setEnsName,
    setInputValue,
  };
};
