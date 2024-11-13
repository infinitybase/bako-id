import { isValidDomain } from '@bako-id/sdk';
import { useIsConnected } from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { debounce } from 'lodash';
import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDomain } from '../../../hooks';

export const useHome = () => {
  const navigate = useNavigate();
  const { isConnected } = useIsConnected();
  const [domain, setDomain] = useState('');
  const { resolveDomain } = useDomain();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [domainIsAvailable, setDomainIsAvailable] = useState<boolean | null>(
    null,
  );

  const debounceSearch = useCallback(
    debounce((value: string) => {
      setIsDisabled(true);
      resolveDomain.mutateAsync(value).then((info) => {
        if (!info) {
          setAvailable(true);
          setTimeout(() => {
            setIsDisabled(false);
          }, 500);
          return;
        }
        setAvailable(false);
        setTimeout(() => {
          setIsDisabled(false);
        }, 500);
      });
    }, 500),
    [],
  );

  const handleChangeDomain = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target ?? {};

    const formattedValue = value.toLowerCase();

    if (formattedValue.length >= 3) {
      setIsDisabled(true);
    }

    if (formattedValue.length < 3) {
      setAvailable(null);
      setDomain(formattedValue);
      return;
    }

    const isValid = isValidDomain(formattedValue);

    if (isValid || !formattedValue) {
      setDomain(formattedValue);
      debounceSearch(formattedValue);
    }
  };

  const handleConfirmDomain = async () => {
    if (isDisabled) {
      return null;
    }
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

  useEffect(() => {
    if (resolveDomain.isPending || available === null)
      return setDomainIsAvailable(null);
    if (!available) return setDomainIsAvailable(false);
    if (available) {
      return setDomainIsAvailable(true);
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
    isDisabled,
  };
};
