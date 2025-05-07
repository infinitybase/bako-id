import type { FunctionInvocationScope } from 'fuels';

export const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>
) => {
  const result = await method.call();
  return result.waitForResult();
};

export const getContractId = (chainId: number) => {
  const contractsId: Record<number, string> = {
    // TESTNET
    0: '0xc905465054211ca2186d2afe389b1ead7d06d484168483c8cbdcd990665b50b1',

    // MAINNET
    9889: '0x0000000000000000000000000000000000000000000000000000000000000000',
  };

  return contractsId[chainId] ?? contractsId[9889];
};
