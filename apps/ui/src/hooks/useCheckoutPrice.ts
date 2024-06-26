import { domainPrices } from '@bako-id/sdk';
import { useParams } from '@tanstack/react-router';
import { bn, type BN } from 'fuels';
import { useMemo } from 'react';
import { useFuelConnect, useUsdPrice } from '.';
import { Coin, type Domains } from '../types';
import { useSimulateHandleCostRequest } from './useSimulateHandleCostRequest';

const coinSymbol = {
  USD: 'USD',
  ETH: 'ETH',
};

export const useCheckoutPrice = (domains: Domains, selectedCoin: Coin) => {
  const { domain } = useParams({ strict: false });
  const { wallet } = useFuelConnect();

  const { usdPrice } = useUsdPrice();
  const simulateHandle = useSimulateHandleCostRequest(
    wallet!,
    wallet?.address.toB256() ?? '',
    domain,
    domains.period,
  );
  const totalPrice = useMemo(() => {
    if (!domains || !simulateHandle.data) return bn(0);

    const ETHPrice = domainPrices(domains.name, domains.period);

    const USDPrice = ETHPrice.mul(usdPrice);

    return selectedCoin === Coin.USD ? USDPrice : ETHPrice;
  }, [domains, simulateHandle.data, usdPrice, selectedCoin]);

  const domainPrice = useMemo(() => {
    if (!domains) return bn(0);

    return selectedCoin === Coin.USD
      ? domainPrices(domains.name, domains.period).mul(usdPrice)
      : domainPrices(domains.name, domains.period);
  }, [domains, selectedCoin, usdPrice]);

  const fee = useMemo(() => {
    if (!simulateHandle.data) return bn(0);

    return selectedCoin === Coin.USD
      ? simulateHandle.data?.fee.mul(usdPrice)
      : simulateHandle.data.fee;
  }, [selectedCoin, simulateHandle.data, usdPrice]);

  const formatCoin = (value: BN, selectedCoin: Coin) => {
    if (!value) return '--.--';

    const formatted = value.format({ precision: 7 });

    return `${formatted} ${coinSymbol[selectedCoin]}`;
  };

  return {
    totalPrice,
    domainPrice,
    fee,
    formatCoin,
  };
};
