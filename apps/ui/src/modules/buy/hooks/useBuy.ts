import { isValidDomain } from '@bako-id/sdk';
import { useEffect, useMemo, useState } from 'react';
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

const assetIds = {
  [Coin.USD]:
    '0xc26c91055de37528492e7e97d91c6f4abe34aae26f2c4d25cff6bfe45b5dc9a9',
};

export const useBuy = () => {
  const { successToast } = useCustomToast();
  const { domain } = useParams({ strict: false });
  const { wallet } = useWallet();

  const { balance: walletBalance, isLoading: loadingEthBalance } = useBalance({
    account: wallet?.address.toAddress(),
  });

  const { balance: usdcBalance, isLoading: loadingUsdcBalance } = useBalance({
    account: wallet?.address.toAddress(),
    assetId: assetIds[Coin.USD],
  });

  const isLoadingBalance = loadingEthBalance || loadingUsdcBalance;

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
      },
    );
  };

  const handleChangeCoin = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  const insufficientBalance = useMemo(() => {
    const balance = {
      [Coin.ETH]: Number(walletBalance?.format()),
      [Coin.USD]: Number(usdcBalance?.formatUnits(6)),
    };

    return balance[selectedCoin] < Number(totalPrice.format());
  }, [selectedCoin, totalPrice, walletBalance, usdcBalance]);

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
    insufficientBalance,
    formatCoin,
    handleChangeCoin,
    handleConfirmDomain,
    totalPrice,
    fee,
    domainPrice,
    loading,
    signProgress,
  };
};

export type UseBuyReturn = ReturnType<typeof useBuy>;
