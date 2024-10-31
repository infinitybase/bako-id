import { ResolverContract } from '@bako-id/sdk';
import { useAccount, useWallet } from '@fuels/react';
import { useMemo } from 'react';

export const useResolverContract = () => {
  const { account } = useAccount();
  const { wallet } = useWallet({ account });

  const contract = useMemo(() => {
    if (!wallet) return null;
    return ResolverContract.create(wallet);
  }, [wallet]);

  return contract;
};
