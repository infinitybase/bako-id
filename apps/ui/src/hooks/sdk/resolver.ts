import { ResolverContract } from '@bako-id/sdk';
import { useMemo } from 'react';
import { useProvider } from '../fuel';

export const useResolverContract = () => {
  const provider = useProvider();

  const contract = useMemo(() => {
    if (!provider) return null;
    return ResolverContract.create(provider);
  }, [provider]);

  return contract;
};
