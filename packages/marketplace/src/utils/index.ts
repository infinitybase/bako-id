import dotenv from 'dotenv';
import type { FunctionInvocationScope } from 'fuels';
import contracts from '../artifacts/contract.json';

dotenv.config();

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

export const requireEnv = (env: string): string => {
  const environment = process.env[env];
  if (!environment) {
    throw new Error(`${env} is not set`);
  }
  return environment;
};
