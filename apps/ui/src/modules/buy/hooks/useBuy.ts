import { isValidDomain } from '@bako-id/sdk';
import { useEffect, useState } from 'react';
import { useDomain, useFuelConnect } from '../../../hooks';
import type { Domains } from '../../../types';

import { useBalance } from '@fuels/react';
import { useParams } from '@tanstack/react-router';
import { useCustomToast } from '../../../components/toast';
import { useCheckoutPrice } from '../../../hooks/useCheckoutPrice';

export enum Coin {
  USD = 'USD',
  ETH = 'ETH',
}

export const useBuy = () => {
  const { successToast } = useCustomToast();
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();
  const { balance: walletBalance, isLoading: isLoadingBalance } = useBalance({
    address: wallet?.address.toAddress(),
  });
  const { registerDomain, resolveDomain } = useDomain();
  const [selectedCoin, setSelectedCoin] = useState<Coin>(Coin.ETH);
  const [signInLoad, setSignInLoad] = useState<boolean>(false);

  const [buyError, setBuyError] = useState<string | undefined>(undefined);
  const [domains, setDomains] = useState<Domains[]>([
    {
      name: domain,
      period: 1,
    },
  ]);
  const { totalPrice, domainPrice, fee, formatCoin, loading } =
    useCheckoutPrice(domains[0], selectedCoin);

  const handlePeriodChange = (index: number, newValue: number) => {
    const newItems = [...domains];
    // TODO: period not specified
    newItems[index] = { ...newItems[index], period: newValue };
    setDomains(newItems);
  };

  const handleConfirmDomain = async () => {
    const isValid = isValidDomain(domain);
    if (!isValid) return;

    const info = await resolveDomain.mutateAsync({
      domain,
      providerURL: wallet!.provider.url,
    });

    return info;
  };

  const handleBuyDomain = async () => {
    const isValid = isValidDomain(domain);
    if (!isValid || !wallet || !walletBalance) return;
    setSignInLoad(true);

    registerDomain.mutate(
      {
        account: wallet,
        resolver: wallet.address.toB256(),
        domain: domain,
        period: domains[0].period,
      },
      {
        onSuccess: async () => {
          await handleConfirmDomain();
          successToast({
            title: 'Transaction success',
            description: 'Your handle has been registered successfully',
          });
          setSignInLoad(false);
        },
        onError: (error: unknown) => {
          // @ts-expect-error error
          console.log({ ...error });
          setBuyError((error as Error).message);
          setSignInLoad(false);
        },
      },
    );
  };

  const handleChangeCoin = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (buyError) {
      timeoutId = setTimeout(() => {
        setBuyError(undefined);
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [buyError]);

  return {
    handleBuyDomain,
    handlePeriodChange,
    registerDomain,
    domains,
    domain,
    selectedCoin,
    buyError,
    signInLoad,
    walletBalance,
    isLoadingBalance,
    formatCoin,
    handleChangeCoin,
    handleConfirmDomain,
    totalPrice,
    fee,
    domainPrice,
    loading,
  };
};

export type UseBuyReturn = ReturnType<typeof useBuy>;
