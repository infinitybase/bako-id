import { isValidDomain } from '@bako-id/sdk';
import { useNavigate } from '@tanstack/react-router';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useDomain } from '../../../hooks';

export const useHome = () => {
  const navigate = useNavigate();
  const { resolveDomain } = useDomain();
  const [domain, setDomain] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);

  const debounceSearch = useCallback(
    debounce((value: string) => {
      resolveDomain
        .mutateAsync({
          domain: value,
          providerURL: 'https://beta-5.fuel.network/graphql',
        })
        .then((info) => {
          if (!info) {
            console.debug(
              "Info returned from 'https://beta-5.fuel.network/graphql'",
              info,
            );
            setAvailable(true);
            return;
          }
          setAvailable(false);
        });
    }, 500),
    [],
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
      }).then();
      return;
    }

    navigate({
      to: '/$domain',
      params: { domain: info.name },
      startTransition: true,
    }).then();
  };

  const domainIsAvailable = useMemo(() => {
    if (resolveDomain.isPending || available === null) return null;
    if (!available) return false;
    if (available) {
      console.debug('available', available);
      return true;
    }
  }, [resolveDomain, available]);

  return {
    domain,
    setDomain,
    available,
    handleChangeDomain,
    handleConfirmDomain,
    domainIsAvailable,
    resolveDomain,
  };
};
