import { type Account, BaseAssetId } from 'fuels';
import { envrionment } from '../config';
import { getRegistryContract } from '../setup';
import {
  NotFoundBalanceError,
  assertValidDomain,
  domainPrices,
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
    storageId: envrionment.STORAGE_CONTRACT_ID!,
  });

  // Change account for the user account!
  registry.account = account;

  const txParams = getTxParams(account.provider);
  const amount = await checkAccountBalance(account, domainName);

  const { transactionResult, transactionResponse, gasUsed, transactionId } =
    await registry.functions
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
  };
}
