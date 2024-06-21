import { BaseAssetId, type Account } from 'fuels';
import { config } from '../config';
import { getRegistryContract } from '../setup';
import {
  NotFoundBalanceError,
  assertValidDomain,
  domainPrices,
  getContractError,
  getTxParams,
} from '../utils';

type RegisterDomainParams = {
  domain: string;
  resolver: string;
  account: Account;
  period?: number;
};

type EditResolverParams = {
  domain: string;
  resolver: string;
  account: Account;
};

type SimulateHandleCostParams = Omit<RegisterDomainParams, 'account'>;

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
async function checkAccountBalance(
  account: Account,
  domain: string,
  period?: number,
) {
  const amount = domainPrices(domain, period);
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
  const { account, domain, resolver, period } = params;

  const domainName = assertValidDomain(domain);

  const { registry } = await getRegistryContract({
    account,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  // Change account for the user account!
  registry.account = account;

  const txParams = getTxParams(account.provider);
  const amount = await checkAccountBalance(account, domainName, period);
  // const amount = await domainPrices(domain, period);

  const {
    transactionResult,
    transactionResponse,
    gasUsed,
    transactionId,
    value,
  } = await registry.functions
    .register(domainName, resolver, period ?? 1)
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
 * @param {SimulateHandleCostParams} params - The parameters for domain registration.
 * @param {string} params.domain - The domain to be registered.
 * @param {string} params.resolver - The resolver for the domain.
 *
 * @return {Promise<Object>} - An object containing the fee and transaction request.
 * @return {BigNumber} fee - The total fee for handling the transaction.
 * @return {TransactionRequest} transactionRequest - The transaction request object.
 */
export async function simulateHandleCost(params: SimulateHandleCostParams) {
  const { domain, resolver, period } = params;

  const domainName = assertValidDomain(domain);

  const { registry } = await getRegistryContract({
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  const txParams = getTxParams(registry.provider);
  const amount = await checkAccountBalance(registry.account!, domainName);

  const transactionRequest = await registry.functions
    .register(domainName, resolver, period ?? 1)
    .callParams({
      forward: { amount, assetId: BaseAssetId },
    })
    .txParams(txParams)
    .getTransactionRequest();

  const { gasUsed, minFee } =
    await registry.account!.provider.getTransactionCost(transactionRequest);

  return {
    fee: gasUsed.add(minFee),
    transactionRequest,
  };
}

/**
 * Edits the resolver for a domain.
 *
 * @param {EditResolverParams} params - The parameters for the resolver edit.
 * @param {string} params.account - The user account.
 * @param {string} params.domain - The domain to be edited.
 * @param {string} params.resolver - The new resolver for the domain.
 *
 * @return {Promise<{
 *   gasUsed: number,
 *   transactionId: string,
 *   transactionResult: any,
 *   transactionResponse: any
 * }>} - The result of the resolver edit.
 */
export async function editResolver(params: EditResolverParams) {
  const { account, domain, resolver } = params;

  const { registry } = await getRegistryContract({
    account,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  // Change account for the user account!
  registry.account = account;

  const txParams = getTxParams(account.provider);

  try {
    const { transactionResult, transactionResponse, gasUsed, transactionId } =
      await registry.functions
        .edit_resolver(domain, resolver)
        .txParams(txParams)
        .call();

    return {
      gasUsed,
      transactionId,
      transactionResult,
      transactionResponse,
    };
  } catch (error) {
    //@ts-ignore
    return getContractError(error);
  }
}
