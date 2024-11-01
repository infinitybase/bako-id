import { ResolverContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useMemo } from 'react';

export const useResolverContract = () => {
  const { provider } = useProvider();

  const contract = useMemo(() => {
    if (!provider) return null;
    return ResolverContract.create(provider);
  }, [provider]);

  return contract;
};
