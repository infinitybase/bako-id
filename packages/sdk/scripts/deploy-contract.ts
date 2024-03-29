import { getTxParams } from '../src/utils';
import { connectContracts, ContractConfig } from '../src/setup';

export const deployContracts = async (config: ContractConfig) => {
    const { storageId, registryId, account } = config;

    const provider = config.provider || config.account?.provider;
    if (!provider) {
      throw new Error('Provider is required to deploy contracts.');
    }

    const { storage, registry } = connectContracts({ account, storageId, registryId });
    const txParams = getTxParams(provider);

    try {
      await registry.functions.constructor(
        { value: account!.address.toB256() },
        { value: storageId })
        .txParams(txParams)
        .call();
    } catch (e) {
      throw new Error(`[DEPLOY] Error on deploy Registry Contract: ${e}`);
    }

    try {
      await storage.functions.constructor(
        { value: account!.address.toB256() },
        { value: registryId! })
        .txParams(txParams)
        .call();
    } catch (e) {
      throw new Error('[DEPLOY] Error on deploy Storage Contract.');
    }
  };
