import { domainPrices } from '@bako-id/sdk';
import { bn, BN } from 'fuels';
import { useMemo } from 'react';
import { useDomain, useUsdPrice } from '.';
import { Coin, Domains } from '../types';

const coinSymbol = {
  USD: '$',
  ETH: 'ETH',
};

export const useCheckoutPrice = (domains: Domains[], selectedCoin: Coin) => {
  const { usdPrice } = useUsdPrice();
  const { simulateHandle } = useDomain();

  const totalPrice = useMemo(() => {
    if (!domains.length || !simulateHandle.data) return bn(0);

    const ETHPrice = domainPrices(domains[0].name, 1);

    const USDPrice = ETHPrice.mul(usdPrice);

    return selectedCoin === Coin.USD ? USDPrice : ETHPrice;
  }, [domains, simulateHandle.data, usdPrice, selectedCoin]);

  const domainPrice = useMemo(() => {
    if (!domains.length) return bn(0);

    return selectedCoin === Coin.USD
      ? domainPrices(domains[0].name, 1).mul(usdPrice)
      : domainPrices(domains[0].name, 1);
  }, [domains, selectedCoin, usdPrice]);

  const fee = useMemo(() => {
    if (!simulateHandle.data) return bn(0);

    return selectedCoin === Coin.USD
      ? simulateHandle.data?.fee.mul(usdPrice)
      : simulateHandle.data.fee;
  }, [selectedCoin, simulateHandle.data, usdPrice]);

  const formatCoin = (value: BN, selectedCoin: Coin) => {
    if (!value) return '--.--';

    const formatted = value.format({ precision: 4 });

    return `${coinSymbol[selectedCoin]} ${formatted}`;
  };

  return {
    totalPrice,
    domainPrice,
    fee,
    formatCoin,
  };
};
