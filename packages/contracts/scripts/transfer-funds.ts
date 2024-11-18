import { getContractId, Manager, Nft, Registry, Resolver } from '../src';
import { logger, requireEnv, setup } from './utils';
import { Wallet } from 'fuels';

const setupRegistry = async () => {
  const { provider, wallet } = await setup();
  const registryId = getContractId(provider.url, 'registry');
  const registry = new Registry(registryId, wallet);

  const recipientAddress = requireEnv('RECIPIENT_ADDRESS');
  const recipientWallet = Wallet.fromAddress(recipientAddress, provider);

  const getBalances = async () => {
    const registryBalance = await registry.getBalance(
      provider.getBaseAssetId(),
    );
    const recipientBalance = await recipientWallet.getBalance();

    logger.info(
      `Transfer funds
    Registry: ${registryBalance.format()} ETH (${registryId})
    Recipient: ${recipientBalance.format()} ETH (${recipientAddress})`,
    );

    return { registryBalance, recipientBalance };
  };

  return {
    provider,
    wallet,
    registry,
    getBalances,
    recipientWallet,
  };
};

const main = async () => {
  const { provider, registry, getBalances, recipientWallet } =
    await setupRegistry();

  const { registryBalance } = await getBalances();

  const { waitForResult } = await registry.functions
    .transfer_funds(
      registryBalance,
      { bits: provider.getBaseAssetId() },
      { bits: recipientWallet.address.toB256() },
    )
    .call();
  await waitForResult();
  logger.success('Transfer funds success!');

  await getBalances();
};

main()
  .then(() => {
    logger.success('Done!');
    process.exit(0);
  })
  .catch((error) => {
    if (error instanceof Error && /NotOwner/.test(error.message)) {
      logger.error('Not owner of registry!');
      return;
    }
    logger.error('Transfer failed!', error);
    process.exit(1);
  });
