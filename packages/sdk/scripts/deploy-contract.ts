import { type ContractConfig, connectContracts } from '../src/setup';
import { getTxParams } from '../src/utils';

export const deployContracts = async (config: ContractConfig) => {
  const { storageId, registryId, account, metadataId, resolverId } = config;

  const provider = config.provider || config.account?.provider;
  if (!provider) {
    throw new Error('Provider is required to deploy contracts.');
  }

  const { storage, registry, metadata, resolver } = connectContracts({
    account,
    storageId,
    registryId,
    metadataId,
    resolverId,
  });
  const txParams = getTxParams(provider);

  try {
    const registryFn = await registry.functions
      .constructor({ bits: account!.address.toB256() }, { bits: storageId })
      .txParams(txParams)
      .call();

    await registryFn.waitForResult();
  } catch (e) {
    console.log(e);
    throw new Error('[DEPLOY] Error on deploy Registry Contract: ');
  }

  try {
    const storageFn = await storage.functions
      .constructor({ bits: account!.address.toB256() }, { bits: registryId! })
      .txParams(txParams)
      .call();

    await storageFn.waitForResult();
  } catch (_e) {
    console.log(_e);
    throw new Error('[DEPLOY] Error on deploy Storage Contract.');
  }

  try {
    if (!metadata) return;

    const metadataFn = await metadata.functions
      .constructor({ bits: storageId })
      .txParams(txParams)
      .call();

    await metadataFn.waitForResult();
  } catch (_e) {
    console.log(_e);
    throw new Error('[DEPLOY] Error on deploy Metadata Contract.');
  }

  try {
    if (!resolver) return;

    const resolverFn = await resolver.functions
      .constructor({ bits: storageId })
      .txParams(txParams)
      .call();

    await resolverFn.waitForResult();
  } catch (_e) {
    console.log(_e);
    throw new Error('[DEPLOY] Error on deploy Resolver Contract.');
  }
};
