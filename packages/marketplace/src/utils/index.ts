import type { FunctionInvocationScope } from 'fuels';
import contracts from '../artifacts/contract.json';

export type MarketplaceContractsName = 'marketplace';
export type ContractsMap = Record<string, Record<string, string>>;

export const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>
) => {
  const result = await method.call();
  return result.waitForResult();
};

export const getContractId = (
  chainId: number,
  name: MarketplaceContractsName
) => {
  // TODO -> remove this when deploying to mainnet
  if (chainId === 9889) {
    return '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  const chainIdStr = chainId.toString();
  const contract = (contracts as ContractsMap)[chainIdStr]?.[name];

  if (!contract) {
    throw new Error(`Contract ${name} not found for chainId ${chainId}`);
  }

  return contract;
};
