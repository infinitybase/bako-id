import { BN, bn } from 'fuels';

export const domainPrices = (domain: string, period = 1) => {
  const domainSize = domain.length;

  if (domainSize < 3) {
    return bn(0);
  }

  const prices = {
    [3]: bn.parseUnits('0.005'),
    [4]: bn.parseUnits('0.001'),
    default: bn.parseUnits('0.0002')
  };

  const price: BN = prices[domainSize] || prices.default;

  return price.mul(period);
};
