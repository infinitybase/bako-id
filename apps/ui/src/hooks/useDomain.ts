import { useParams } from '@tanstack/react-router';
import { useFuelConnect } from '.';
import { useGetAllDomainRequests } from './useGetAllDomainsRequests';
import { useRegisterDomainRequests } from './useRegisterDomainRequests';
import { useResolveDomainRequests } from './useResolveDomainRequests';
import { useResolveNameRequests } from './useResolveNameRequests';
import { useResolveOwnerRequests } from './useResolveOwnerRequests';
import { useSimulateHandleCostRequest } from './useSimulateHandleCostRequest';

export const useDomain = (newDomain?: string) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();

  const registerDomain = useRegisterDomainRequests();
  const resolveDomain = useResolveDomainRequests(newDomain ?? domain);
  const resolveName = useResolveNameRequests(wallet?.address.toB256() ?? '');
  const resolveOwner = useResolveOwnerRequests(newDomain ?? domain);
  const getAllDomains = useGetAllDomainRequests(wallet?.address.toB256() ?? '');

  const simulateHandle = useSimulateHandleCostRequest(
    wallet!,
    wallet?.address.toB256() ?? '',
    domain,
  );

  return {
    registerDomain,
    resolveName,
    resolveOwner,
    resolveDomain,
    simulateHandle,
    getAllDomains,
  };
};
