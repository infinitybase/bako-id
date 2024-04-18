import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';

const fetchUSD = async (convert = 'ETH-USD') =>
  await fetch(`https://economia.awesomeapi.com.br/last/${convert}`)
    .then(async (response) => {
      const data = await response.json();
      return data[convert.replace('-', '')].bid ?? 0;
    })
    .catch(() => {
      return 0.0;
    });

export const useUsdPrice = () => {
  const { data: usdPrice, ...ethUSDQuery } = useQuery({
    queryKey: ['<KEY>'],
    queryFn: () => fetchUSD(),
  });

  return {
    ...ethUSDQuery,
    usdPrice: bn(Number(usdPrice)),
  };
};
