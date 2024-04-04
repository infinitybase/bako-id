import { useAccount, useWallet } from '@fuels/react';

export const useFuelConnect = () => {
  const { account } = useAccount();
  const { wallet } = useWallet(account);

  return {
    wallet,
    currentAccount: account,
  };
};
