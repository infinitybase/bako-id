import { type ContractConfig, connectContracts } from '../src/setup';
import { getTxParams } from '../src/utils';

type DeployContractConfig = Omit<Required<ContractConfig>, 'provider'> & {
  attester?: string;
};

export const deployContracts = async (config: DeployContractConfig) => {
  const {
    account,
    attester,
    storageId,
    registryId,
    metadataId,
    resolverId,
    attestationId,
  } = config;

  const provider = config.account?.provider;
  if (!provider) {
    throw new Error('Provider is required to deploy contracts.');
  }

  const { storage, registry, metadata, resolver, attestation } =
    connectContracts({
      account,
      storageId,
      registryId,
      metadataId,
      resolverId,
      attestationId,
    });
  const txParams = getTxParams(provider);

  try {
    const registryFn = await registry.functions
      .constructor(
        { bits: account!.address.toB256() },
        { bits: storageId },
        { bits: attestationId },
      )
      .txParams(txParams)
      .call();

    await registryFn.waitForResult();
  } catch (e) {
    console.log(e);
    throw new Error('[DEPLOY] Error on deploy Registry Contract: ');
  }

  try {
    const storageFn = await storage.functions
      .constructor({ bits: account!.address.toB256() }, { bits: registryId })
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

  try {
    if (!attestation || !attester) return;

    const resolverFn = await attestation.functions
      .constructor({ bits: attester })
      .txParams(txParams)
      .call();

    await resolverFn.waitForResult();
  } catch (_e) {
    console.log(_e);
    throw new Error('[DEPLOY] Error on deploy Attestation Contract.');
  }
};
