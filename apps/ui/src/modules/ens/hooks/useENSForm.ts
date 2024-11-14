import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useGetENSData } from '../../../hooks';

export type CustomAutocompleteValue = {
  ens: string;
};

export const useENSForm = () => {
  const [ensName, setEnsName] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const { data, isLoading, refetch } = useGetENSData(ensName);

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<CustomAutocompleteValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      ens: '',
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.includes('.eth') || value.includes('.box')) {
      setEnsName(value);
      setValue('ens', value);
      refetch();
    }
  };

  return {
    control,
    errors,
    handleInputChange,
    ensData: data,
    isLoading,
    inputValue,
  };
};
