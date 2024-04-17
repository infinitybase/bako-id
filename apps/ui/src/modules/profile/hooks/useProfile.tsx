import type { Domain } from '@bako-id/sdk';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDomain } from '../../../hooks';

export const useProfile = () => {
  const { domain: domainParam } = useParams({ strict: false });
  const { resolveDomain } = useDomain();

  const [domain, setDomain] = useState<Domain | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    resolveDomain.mutateAsync(domainParam).then((data) => setDomain(data));
  }, [domainParam]);

  return {
    domain,
    resolveDomain,
  };
};
