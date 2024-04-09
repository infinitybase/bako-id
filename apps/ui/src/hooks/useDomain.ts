import { useParams } from '@tanstack/react-router';
import { useFuelConnect } from '.';
import { useRegisterDomainRequests } from './useRegisterDomainRequests';
import { useResolveDomainRequests } from './useResolveDomainRequests';
import { useSimulateHandleCostRequest } from './useSimulateHandleCostRequest';

export const useDomain = (newDomain?: string) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();

  const registerDomain = useRegisterDomainRequests();
  const resolveDomain = useResolveDomainRequests(domain ?? newDomain);
  const simulateHandle = useSimulateHandleCostRequest(
    wallet!,
    wallet?.address.toB256() ?? '',
    domain,
  );

  return {
    registerDomain,
    resolveDomain,
    simulateHandle,
  };
};
