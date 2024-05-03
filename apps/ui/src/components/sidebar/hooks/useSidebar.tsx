import { useWallet } from '@fuels/react';
import { useMemo } from 'react';
import { useProfile } from '../../../modules/profile/hooks/useProfile';

export const useSidebar = () => {
  const { wallet } = useWallet();
  const { domain } = useProfile();

  const isMyDomain = useMemo(() => {
    return wallet?.address.toB256() === domain;
  }, [domain, wallet]);

  return {
    isMyDomain,
  };
};
