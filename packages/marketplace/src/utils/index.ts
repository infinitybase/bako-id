import type { FunctionInvocationScope } from 'fuels';

export const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>,
) => {
  const result = await method.call();
  return result.waitForResult();
};

export const getContractId = (chainId: number) => {
  const contractsId: Record<number, string> = {
    0: '0x0000000000000000000000000000000000000000000000000000000000000000',
    9889: '0x0000000000000000000000000000000000000000000000000000000000000000',
  };

  return contractsId[chainId] ?? contractsId[9889];
};
