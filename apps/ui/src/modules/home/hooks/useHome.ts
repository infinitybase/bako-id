import { isValidDomain } from '@bako-id/sdk';
import { useFuel } from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { debounce } from 'lodash';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDomain } from '../../../hooks';

export const useHome = () => {
  const navigate = useNavigate();
  const {
    fuel: { isConnected: WalletConnected, connect },
  } = useFuel();
  const [domain, setDomain] = useState('');
  const { resolveDomain } = useDomain(domain);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const checkConnection = async () => {
      await WalletConnected().then((result) => {
        setIsConnected(result);
      });
    };
    checkConnection();
  }, [WalletConnected, connect]);

  const debounceSearch = useCallback(
    debounce((value: string) => {
      resolveDomain
        .mutateAsync({
          domain: value,
        })
        .then((info) => {
          if (!info) {
            setAvailable(true);
            return;
          }
          setAvailable(false);
        });
    }, 500),
    []
  );

  const handleChangeDomain = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target ?? {};
  
    if (value.length < 3) {
      setAvailable(null);
      setDomain(value);
      return;
    }
    const isValid = isValidDomain(value);

    if (isValid || !value) {
      setDomain(value);
      debounceSearch(value);
    }
  };

  const handleConfirmDomain = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    const isValid = isValidDomain(domain);
    if (!isValid) return;

    const info = resolveDomain.data;

    if (!info) {
      navigate({
        to: '/buy/$domain',
        params: { domain: domain },
        startTransition: true,
      });
      return;
    }

    navigate({
      to: '/profile/$domain',
      params: { domain },
      startTransition: true,
    });
  };

  const domainIsAvailable = useMemo(() => {
    if (resolveDomain.isPending || available === null) return null;
    if (!available) return false;
    if (available) {
      return true;
    }
  }, [resolveDomain, available]);

  return {
    domain,
    setDomain,
    isConnected,
    available,
    handleChangeDomain,
    handleConfirmDomain,
    domainIsAvailable,
    resolveDomain,
  };
};
