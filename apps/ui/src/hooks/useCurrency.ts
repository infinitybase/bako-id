import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';

const API_URL = 'https://economia.awesomeapi.com.br/last';
const ETH_USD_PRICE_QUERY_KEY = 'eth-usd-price';

const fetchUSD = async (convert = 'ETH-USD') =>
  await fetch(`${API_URL}/${convert}`)
    .then(async (response) => {
      const data = await response.json();
      return data[convert.replace('-', '')].bid ?? 0;
    })
    .catch(() => {
      return 0.0;
    });

export const useUsdPrice = () => {
  const { data: usdPrice, ...ethUSDQuery } = useQuery({
    queryKey: [ETH_USD_PRICE_QUERY_KEY],
    queryFn: () => fetchUSD(),
  });

  return {
    ...ethUSDQuery,
    usdPrice: bn(Number(usdPrice)),
  };
};
