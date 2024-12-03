import { useParams } from '@tanstack/react-router';
import { useQueryResolveDomainRequests } from '../../../hooks/useQueryResolveDomainRequests';
import { useResolveOwnerRequests } from '../../../hooks/useResolveOwnerRequests';

export const useProfile = () => {
  const { domain: domainParam, externalDomain } = useParams({ strict: false });
  const resolveDomain = useQueryResolveDomainRequests(
    domainParam ?? externalDomain
  );
  const resolveOwner = useResolveOwnerRequests(domainParam ?? externalDomain);

  return {
    owner: resolveOwner.data,
    domain: resolveDomain.data,
    domainMethods: resolveDomain,
    isLoadingDomain: resolveDomain.isPending,
    domainParam: domainParam ?? externalDomain,
    isExternal: !!externalDomain,
  };
};
