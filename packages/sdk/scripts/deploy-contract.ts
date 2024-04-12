import { type ContractConfig, connectContracts } from '../src/setup';
import { getTxParams } from '../src/utils';

export const deployContracts = async (config: ContractConfig) => {
  const { storageId, registryId, account } = config;

  const provider = config.provider || config.account?.provider;
  if (!provider) {
    throw new Error('Provider is required to deploy contracts.');
  }

  const { storage, registry } = connectContracts({
    account,
    storageId,
    registryId,
  });
  const txParams = getTxParams(provider);

  try {
    await registry.functions
      .constructor({ value: account!.address.toB256() }, { value: storageId })
      .txParams(txParams)
      .call();
  } catch (e) {
    console.log(e);
    throw new Error('[DEPLOY] Error on deploy Registry Contract: ');
  }

  try {
    await storage.functions
      .constructor({ value: account!.address.toB256() }, { value: registryId! })
      .txParams(txParams)
      .call();
  } catch (_e) {
    throw new Error('[DEPLOY] Error on deploy Storage Contract.');
  }
};
