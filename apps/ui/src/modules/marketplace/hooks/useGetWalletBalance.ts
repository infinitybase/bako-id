import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';

export const useGetWalletBalance = () => {
  const { wallet } = useWallet();

  const { data, isLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => wallet?.getBalances(),
  });

  return { data, isLoading };
};
