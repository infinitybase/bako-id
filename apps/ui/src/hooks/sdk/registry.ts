import { RegistryContract } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { useMemo } from 'react';

export const useRegistryContract = () => {
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (!wallet) return null;
    return RegistryContract.create(wallet);
  }, [wallet]);

  return contract;
};
