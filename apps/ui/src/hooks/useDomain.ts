import { useParams } from '@tanstack/react-router';
import { useFuelConnect, useResolveDomainRequests } from '.';
import { useRegisterDomainRequests } from './useRegisterDomainRequests';
import { useResolveNameRequests } from './useResolveNameRequests';
import { useResolveOwnerRequests } from './useResolveOwnerRequests';

export const useDomain = (newDomain?: string) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();

  const registerDomain = useRegisterDomainRequests();
  const resolveDomain = useResolveDomainRequests(newDomain ?? domain);
  const resolveName = useResolveNameRequests(wallet?.address.toB256() ?? '');
  const resolveOwner = useResolveOwnerRequests(newDomain ?? domain);

  return {
    registerDomain,
    resolveName,
    resolveOwner,
    resolveDomain,
  };
};
