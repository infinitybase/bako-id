import { BakoIDClient, RegistryContract } from '@bako-id/sdk';
import { useWallet } from '@fuels/react';
import { useMemo } from 'react';

export const useRegistryContract = () => {
  const { wallet } = useWallet();

  const contract = useMemo(() => {
    if (!wallet) return null;
    const client = new BakoIDClient(
      wallet.provider,
      import.meta.env.VITE_API_URL
    );
    return RegistryContract.create(wallet, client);
  }, [wallet]);

  return contract;
};
