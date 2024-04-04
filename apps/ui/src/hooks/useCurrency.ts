import { useState } from 'react';

export const useCalculateDomain = () => {
  const [balance, setBalance] = useState<number>(0.0);

  const convert = `ETH-USD`;

  const fetchUSD = async () =>
    await fetch(`https://economia.awesomeapi.com.br/last/${convert}`)
      .then(async (response) => {
        const data = await response.json();
        setBalance(data[convert.replace('-', '')].bid ?? 0.0);
        return data[convert.replace('-', '')].bid ?? 0.0;
      })
      .catch((e) => {
        console.log('[BALANCE]: ', e);
        return 0.0;
      });

  return {
    fetchUSD,
    balance,
    setBalance,
  };
};
