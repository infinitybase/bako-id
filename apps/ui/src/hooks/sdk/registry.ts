import { RegistryContract } from '@bako-id/sdk';
import { useAccount, useWallet } from '@fuels/react';
import { useMemo } from 'react';

export const useRegistryContract = () => {
  const { account } = useAccount();
  const { wallet } = useWallet({ account });

  const contract = useMemo(() => {
    console.log('wallet', wallet);
    if (!wallet) return null;
    return RegistryContract.create(wallet);
  }, [wallet]);

  return contract;
};
