import { useWallet } from '@fuels/react';
import { useMemo } from 'react';
import { useProfile } from '../../../modules/profile/hooks/useProfile';

export const useSidebar = () => {
  const { wallet } = useWallet();
  const { owner } = useProfile();

  const isMyDomain = useMemo(() => {
    return wallet?.address.toB256() === owner;
  }, [owner, wallet]);

  return {
    isMyDomain,
  };
};
