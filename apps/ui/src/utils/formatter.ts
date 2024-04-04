const coinSymbol = {
  USD: '$',
  ETH: 'ETH',
};

enum Coin {
  USD = 'USD',
  ETH = 'ETH',
}

const formatCoin = (value: number, selectedCoin: Coin) => {
  if (!value) return '--.--';

  const formatted = value.toLocaleString('en-US', {
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2,
  });

  return `${coinSymbol[selectedCoin]} ${formatted}`;
};

const formatAddress = (address: string, factor?: number) => {
  const size = factor ?? 10;

  if (!address) return;
  return `${address.slice(0, size)}...${address.slice(-1 * (size / 2))}`;
};

export { formatCoin, formatAddress };
