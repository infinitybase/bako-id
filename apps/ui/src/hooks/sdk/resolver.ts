import { ResolverContract } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { useMemo } from 'react';

export const useResolverContract = () => {
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    console.log(wallet);
    if (!wallet) return null;
    return ResolverContract.create(wallet);
  }, [wallet]);

  return contract;
};
