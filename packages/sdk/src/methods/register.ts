import { type Account, BaseAssetId } from 'fuels';
import { config } from '../config';
import { getRegistryContract } from '../setup';
import {
  NotFoundBalanceError,
  type ProviderParams,
  assertValidDomain,
  domainPrices,
  getProviderFromParams,
  getTxParams,
} from '../utils';

type RegisterDomainParams = {
  domain: string;
  resolver: string;
  account: Account;
};

/**
 * Checks if the account has sufficient balance to cover the given domain price.
 *
 * @param {Account} account - The account object to check the balance of.
 * @param {string} domain - The domain for which to check the price.
 *
 * @throws {NotFoundBalanceError} If the account balance is not sufficient to cover the domain price.
 *
 * @return {Promise<BigNumber>} The domain price.
 */
async function checkAccountBalance(account: Account, domain: string) {
  const amount = domainPrices(domain);
  const accountBalance = await account.getBalance();
  const hasBalance = accountBalance.gte(amount);
  if (!hasBalance) {
    throw new NotFoundBalanceError();
  }
  return amount;
}

/**
 * Registers a domain.
 *
 * @param {RegisterDomainParams} params - The parameters for the registration.
 * @param {string} params.account - The user account.
 * @param {string} params.domain - The domain to be registered.
 * @param {string} params.resolver - The resolver contract for the domain.
 *
 * @return {Promise<{
 *   gasUsed: number,
 *   transactionId: string,
 *   transactionResult: any,
 *   transactionResponse: any
 * }>} - The result of the registration.
 */
export async function register(params: RegisterDomainParams) {
  const { account, domain, resolver } = params;

  const domainName = assertValidDomain(domain);

  const { registry } = await getRegistryContract({
    account,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  // Change account for the user account!
  registry.account = account;

  const txParams = getTxParams(account.provider);
  const amount = await checkAccountBalance(account, domainName);

  const {
    transactionResult,
    transactionResponse,
    gasUsed,
    transactionId,
    value,
  } = await registry.functions
    .register(domainName, resolver)
    .callParams({
      forward: { amount, assetId: BaseAssetId },
    })
    .txParams(txParams)
    .call();

  return {
    gasUsed,
    transactionId,
    transactionResult,
    transactionResponse,
    assetId: value.value,
  };
}

/**
 * Simulates the cost of bako handle registration.
 *
 * @param {RegisterDomainParams} params - The parameters for domain registration.
 * @param {string} params.account - The user's account.
 * @param {string} params.domain - The domain to be registered.
 * @param {string} params.resolver - The resolver for the domain.
 *
 * @return {Promise<Object>} - An object containing the fee and transaction request.
 * @return {BigNumber} fee - The total fee for handling the transaction.
 * @return {TransactionRequest} transactionRequest - The transaction request object.
 */
export async function simulateHandleCost(params: RegisterDomainParams) {
  const { account, domain, resolver } = params;

  const domainName = assertValidDomain(domain);

  const { registry } = await getRegistryContract({
    account,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  // Change account for the user account!
  registry.account = account;

  const txParams = getTxParams(account.provider);
  const amount = await checkAccountBalance(account, domainName);

  const transactionRequest = await registry.functions
    .register(domainName, resolver)
    .callParams({
      forward: { amount, assetId: BaseAssetId },
    })
    .txParams(txParams)
    .getTransactionRequest();

  const { gasUsed, minFee } =
    await account.provider.getTransactionCost(transactionRequest);

  return {
    fee: gasUsed.add(minFee),
    transactionRequest,
  };
}

type Handle = {
  name: string;
  isPrimary: boolean;
};

/**
 * Retrieves all handles by owner address. Returns the handle name and a boolean indicating if it is the primary domain.
 * @param {string} owner - The owner of the records.
 * @param {ProviderParams} [params] - Additional provider parameters.
 * @returns {Promise<Handle[]>} - A promise that resolves to an array of domain records.
 */
export async function getAll(owner: string, params?: ProviderParams) {
  const provider = await getProviderFromParams(params);
  const { registry } = await getRegistryContract({
    provider,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  const { value } = await registry.functions.get_all(owner).get();

  return convertBytesToDomain(Array.from(value));
}

function convertBytesToDomain(bytes: number[]) {
  const result: Handle[] = [];

  const [, nameSize] = bytes.splice(0, 2);
  const name = String.fromCharCode(...bytes.splice(0, nameSize));

  const [, boolSize] = bytes.splice(0, 2);
  const [isPrimary] = bytes.splice(0, boolSize);
  result.push({ name, isPrimary: !!isPrimary });

  if (bytes.length) {
    result.push(...convertBytesToDomain(bytes));
  }

  return result;
}
