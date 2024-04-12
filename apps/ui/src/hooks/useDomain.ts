import { isValidDomain } from '@bako-id/sdk';
import { useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useFuelConnect } from '.';
import type { Domains } from '../types';
import { useRegisterDomainRequests } from './useRegisterDomainRequests';
import { useResolveDomainRequests } from './useResolveDomainRequests';
import { useSimulateHandleCostRequest } from './useSimulateHandleCostRequest';

export const useDomain = (newDomain?: string) => {
  const { domain } = useParams({ strict: false });
  const toast = useToast();
  const navigate = useNavigate();
  const { wallet } = useFuelConnect();

  const registerDomain = useRegisterDomainRequests();
  const resolveDomain = useResolveDomainRequests(domain ?? newDomain);
  const simulateHandle = useSimulateHandleCostRequest(
    wallet!,
    wallet?.address.toB256() ?? '',
    domain,
  );

  const [domains, setDomains] = useState<Domains[]>([
    {
      name: domain,
      period: 1,
    },
  ]);

  const handleConfirmDomain = async () => {
    const isValid = isValidDomain(domain);
    if (!isValid) return;

    const info = await resolveDomain.mutateAsync({
      domain,
      providerURL: wallet!.provider.url,
    });

    console.debug(info?.name);
    return info;
  };

  const handleBuyDomain = async () => {
    const isValid = isValidDomain(domain);
    if (!isValid || !wallet) return;

    registerDomain.mutate(
      {
        account: wallet,
        resolver: wallet.address.toB256(),
        domain: domain,
      },
      {
        onSuccess: async () => {
          await handleConfirmDomain();
          // domainDetailsDialog.onOpen();
          toast({
            title: 'Success!',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          navigate({
            to: '/checkout/$domain',
            params: { domain: domain },
            startTransition: true,
          }).then();
        },
        onError: console.log,
      },
    );
  };

  const handlePeriodChange = (index: number, newValue: number) => {
    const newItems = [...domains];
    // period not specified
    newItems[index] = { ...newItems[index], period: newValue };
    setDomains(newItems);
  };

  return {
    registerDomain,
    resolveDomain,
    simulateHandle,
    handleBuyDomain,
    handlePeriodChange,
    domains,
    setDomains,
  };
};
