import { RegistryContract } from '@bako-id/sdk';
import { useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useSimulateHandleCostRequest = (domain: string, period: number) => {
  const { provider } = useProvider();

  const debouncedSearch = useDebounce([domain, period, provider], 500);

  return useQuery({
    queryKey: ['simulateHandleCost', ...debouncedSearch],
    queryFn: async () => {
      let registryContract: RegistryContract;

      if (provider) {
        registryContract = RegistryContract.create(provider);
      } else {
        const provider = new Provider(import.meta.env.VITE_PROVIDER_URL);
        registryContract = RegistryContract.create(provider);
      }

      return registryContract?.simulate({
        domain,
        period,
      });
    },
    enabled: !!domain && !!period,
  });
};

export { useSimulateHandleCostRequest };
