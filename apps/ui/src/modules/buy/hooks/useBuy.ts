import { isValidDomain } from '@bako-id/sdk';
import { useEffect, useState } from 'react';
import { useDomain } from '../../../hooks';
import type { Domains } from '../../../types';

import { useBalance, useWallet } from '@fuels/react';
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
  const { wallet } = useWallet();
  const { balance: walletBalance, isLoading: isLoadingBalance } = useBalance({
    account: wallet?.address.toAddress(),
  });
  const { registerDomain, resolveDomain } = useDomain(domain);
  const [selectedCoin, setSelectedCoin] = useState<Coin>(Coin.ETH);
  const [signInLoad, setSignInLoad] = useState<boolean>(false);
  const [signProgress, setSignProgress] = useState<number>(0);

  const [buyError, setBuyError] = useState<string | undefined>(undefined);
  const [domains, setDomains] = useState<Domains[]>([
    {
      name: domain,
      period: 1,
    },
  ]);
  const { totalPrice, totalPriceETH, domainPrice, fee, formatCoin, loading } =
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
    const info = await resolveDomain.mutateAsync(domain);
    return info;
  };

  const handleBuyDomain = async (resolverAddress: string) => {
    setSignProgress(33);
    const isValid = isValidDomain(domain);
    if (!isValid || !resolverAddress || !walletBalance) return;
    setSignInLoad(true);

    setTimeout(() => {
      setSignProgress(66);
    }, 700);

    registerDomain.mutate(
      {
        resolver: resolverAddress,
        domain: domain,
        period: domains[0].period,
      },
      {
        onSuccess: async () => {
          setSignProgress(100);
          await handleConfirmDomain();
          successToast({
            title: 'Transaction success',
            description: 'Your handle has been registered successfully',
          });
          setSignInLoad(false);
        },
        onError: (error: unknown) => {
          setSignProgress(0);
          setBuyError((error as Error).message);
          setSignInLoad(false);
        },
      }
    );
  };

  const handleChangeCoin = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

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
    totalPriceETH,
    fee,
    domainPrice,
    loading,
    signProgress,
  };
};

export type UseBuyReturn = ReturnType<typeof useBuy>;
