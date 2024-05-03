import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDomain } from '../../../hooks';
import type { Option } from '../../../types';

export const useProfile = () => {
  const { domain: domainParam } = useParams({ strict: false });
  const { resolveDomain, resolveOwner } = useDomain();

  const [domain, setDomain] = useState<Option<string>>('');
  const [owner, setOwner] = useState<Option<string | null>>('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    resolveDomain.mutateAsync(domainParam).then((data) => setDomain(data));
    resolveOwner.mutateAsync(domainParam).then((data) => setOwner(data));
  }, [domainParam]);

  return {
    owner,
    domain,
    domainParam,
  };
};
