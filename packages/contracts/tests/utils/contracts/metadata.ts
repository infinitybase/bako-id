import type { WalletUnlocked } from 'fuels';
import { MetadataContract, MetadataContractFactory } from '../../../src';

export class TestMetadataContract extends MetadataContract {
  static async startup({
    owner,
    storageId,
  }: {
    owner: WalletUnlocked;
    storageId: string;
  }) {
    const contract = await TestMetadataContract.deploy(owner);
    await contract.functions.constructor({ bits: storageId }).call();
    return new TestMetadataContract(contract.id, owner);
  }

  static async deploy(owner: WalletUnlocked) {
    const deployFn = await MetadataContractFactory.deploy(owner);
    const { contract } = await deployFn.waitForResult();
    return new TestMetadataContract(contract.id, owner);
  }

  async initialize(params: { storageId: string }) {
    const { storageId } = params;
    const callFn = await this.functions.constructor({ bits: storageId }).call();
    return callFn.waitForResult();
  }
}
