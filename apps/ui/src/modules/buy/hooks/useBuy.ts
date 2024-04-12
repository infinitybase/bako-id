import { domainPrices, isValidDomain } from '@bako-id/sdk';
import { useEffect, useMemo, useState } from 'react';
import { useCalculateDomain, useDomain, useFuelConnect } from '../../../hooks';
import type { Domains } from '../../../types';

import { useToast } from '@chakra-ui/react';
import { useBalance } from '@fuels/react';
import { useNavigate, useParams } from '@tanstack/react-router';

const coinSymbol = {
  USD: '$',
  ETH: 'ETH',
};

export enum Coin {
  USD = 'USD',
  ETH = 'ETH',
}
export const useBuy = () => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();
  const { balance, fetchUSD } = useCalculateDomain();
  const { balance: walletBalance, isLoading: isLoadingBalance } = useBalance({
    address: wallet?.address.toAddress(),
  });
  const { registerDomain, resolveDomain, simulateHandle } = useDomain();
  const [selectedCoin, setSelectedCoin] = useState<Coin>(Coin.ETH);
  const [signInLoad, setSignInLoad] = useState<boolean>(false);
  registerDomain.error;
  const toast = useToast();
  const navigate = useNavigate();

  const [period, setPeriod] = useState<number>(1);
  const [buyError, setBuyError] = useState<string | undefined>(undefined);
  const [domains, setDomains] = useState<Domains[]>([
    {
      name: domain,
      period,
    },
  ]);

  const totalPrice = useMemo(() => {
    return domains.reduce((previous, current) => {
      const domainPrice = domainPrices(current.name, 1).format();

      return selectedCoin === Coin.USD
        ? previous +
            (Number(domainPrice) + Number(simulateHandle.data?.fee.format())) *
              balance
        : previous + Number(domainPrice);
    }, 0);
  }, [balance, domains, selectedCoin]);

  const handlePeriodChange = (index: number, newValue: number) => {
    const newItems = [...domains];
    // period not specified
    newItems[index] = { ...newItems[index], period: newValue };
    setDomains(newItems);
    setPeriod(newValue);
  };

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
    console.log(wallet);
    if (!isValid || !wallet || !walletBalance) return;
    setSignInLoad(true);

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
          setSignInLoad(false);
        },
        onError: (error: unknown) => {
          setBuyError((error as Error).message);
          setSignInLoad(false);
        },
      },
    );
  };

  const formatCoin = (value: number, selectedCoin: Coin) => {
    if (!value) return '--.--';

    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

    return `${coinSymbol[selectedCoin]} ${formatted}`;
  };

  const handleChangeCoin = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchUSD();
  }, [selectedCoin]);

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
    handleCost: {
      ...simulateHandle,
      data: simulateHandle.data,
    },
    balance,
    totalPrice,
    domains,
    selectedCoin,
    buyError,
    signInLoad,
    walletBalance: walletBalance?.format(),
    isLoadingBalance,
    formatCoin,
    handleChangeCoin,
    handleConfirmDomain,
  };
};
