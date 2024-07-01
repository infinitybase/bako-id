import { useParams } from '@tanstack/react-router';
import { useQueryResolveDomainRequests } from '../../../hooks/useQueryResolveDomainRequests';
import { useResolveOwnerRequests } from '../../../hooks/useResolveOwnerRequests';

export const useProfile = () => {
  const { domain: domainParam } = useParams({ strict: false });

  const resolveDomain = useQueryResolveDomainRequests(domainParam);
  const resolveOwner = useResolveOwnerRequests(domainParam);

  return {
    owner: resolveOwner.data,
    domain: resolveDomain.data,
    domainMethods: resolveDomain,
    isLoadingDomain: resolveDomain.isPending,
    domainParam,
  };
};
