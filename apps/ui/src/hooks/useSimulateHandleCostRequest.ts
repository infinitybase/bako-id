import { useQuery } from '@tanstack/react-query';
import { useRegistryContract } from './sdk';

const useSimulateHandleCostRequest = (domain: string, period: number) => {
  const registryContract = useRegistryContract();
  return useQuery({
    queryKey: ['simulateHandleCost', period],
    queryFn: async () =>
      registryContract?.simulate({
        domain,
        period,
      }),
    enabled: !!domain && !!period && !!registryContract,
  });
};

export { useSimulateHandleCostRequest };
