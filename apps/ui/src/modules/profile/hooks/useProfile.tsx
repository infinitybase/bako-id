import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDomain } from '../../../hooks';

export const useProfile = () => {
  const { domain: domainParam } = useParams({ strict: false });
  const { resolveDomain, resolveOwner } = useDomain();
  
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    resolveDomain.mutateAsync(domainParam)
    resolveOwner.mutateAsync(domainParam)
  }, [domainParam]);

  return {
    owner: resolveOwner.data,
    domain: resolveDomain.data,
    domainParam,
  };
};
