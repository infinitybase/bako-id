import { useProvider as useFuelProvider } from '@fuels/react';
import { Provider } from 'fuels';
import { useEffect, useState } from 'react';

export const useProvider = () => {
  const { provider: fuelProvider } = useFuelProvider();
  const [provider, setProvider] = useState(fuelProvider);

  useEffect(() => {
    if (!fuelProvider) {
      Provider.create(import.meta.env.VITE_PROVIDER_URL).then((p) =>
        setProvider(p)
      );
    } else {
      setProvider(fuelProvider);
    }
  }, [fuelProvider]);

  return provider;
};
