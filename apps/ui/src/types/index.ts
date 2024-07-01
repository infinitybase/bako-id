import type * as fuels from 'fuels';
import type { ReactElement } from 'react';

export enum Coin {
  USD = 'USD',
  ETH = 'ETH',
}

export enum ExplorerTypes {
  ASSETS = '/assets',
  TRANSACTIONS = '/transactions',
}

export interface Domains {
  name: string;
  period: number;
}
export type Handle = {
  name: string;
  isPrimary: boolean;
};

export type EditResolverParams = {
  domain: string;
  resolver: string;
  account: fuels.Account;
};

export type Option<T> = T | undefined;

export type ResolverReturn = Option<string>;

export interface IChildren {
  children?: ReactElement | ReactElement[];
}

/**
 * Represents the payload for registering a domain.
 *
 * @param {fuels.BN} gasUsed - The gas used for the transaction.
 * @param {string} transactionId - The transaction ID.
 * @param {fuels.TransactionResult<void>} transactionResult - The transaction result.
 * @param {fuels.TransactionResponse} transactionResponse - The transaction response.
 */

export interface RegisterDomainResponse {
  gasUsed: fuels.BN;
  transactionId: string;
  transactionResult: fuels.TransactionResult<void>;
  transactionResponse: fuels.TransactionResponse;
}

/**
 * Represents the payload for registering a domain.
 *
 * @param {string} domain - The domain name to be registered.
 * @param {fuels.Account} account - The account from Fuels to register the domain.
 * @param {string} resolver - The resolver to use for the domain. (Normally using the wallet address in B256).
 */

export interface RegisterDomainPayload {
  domain: string;
  resolver: string;
  account: fuels.Account;
  period: number;
}

export interface ProviderParams {
  account?: fuels.Account;
  provider?: fuels.Provider;
  providerURL?: string;
}

export interface GracePeriodResponse {
  timestamp: Date;
  period: Date;
  gracePeriod: Date;
}

/**
 * Resolves domain using the given parameters.
 *
 * It's a obligatory to pass the domain to resolve.
 * @param {string} domain - The domain to resolve.
 *
 * Optional parameters:
 * @param {fuels.Account} account - The account from Fuels to register the domain.
 * @param {fuels.Provider} provider - The provider from Fuels to register the domain.
 * @param {string} providerURL - The provider URL from Fuels to register the domain.
 *
 * @returns {Promise<ResolverReturn>} - A promise that resolves to the result of resolving the domain.
 */

export interface ResolverDomainPayload {
  domain: string;
  account?: fuels.Account;
  provider?: fuels.Provider;
  providerURL?: string;
}

export type TokenInfo = {
  name: string;
  image: string;
  symbol: string;
  subId: string;
  contractId: string;
};

export interface ResolverDomainResponse {
  name: string;
}
