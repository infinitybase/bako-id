import type { WalletUnlocked } from 'fuels';
import { StorageContract, StorageContractFactory } from '../../../src';

export class TestStorageContract extends StorageContract {
  static async startup(owner: WalletUnlocked, registryId: string) {
    const contract = await TestStorageContract.deploy(owner);

    await contract.initialize(owner, registryId);

    return new TestStorageContract(contract.id, owner);
  }

  static async deploy(owner: WalletUnlocked) {
    const deployFn = await StorageContractFactory.deploy(owner);
    const result = await deployFn.waitForResult();
    const { contract } = result;
    return new TestStorageContract(contract.id, owner);
  }

  async initialize(owner: WalletUnlocked, registryId: string) {
    const callFn = await this.functions
      .constructor({ bits: owner.address.toB256() }, { bits: registryId })
      .call();
    await callFn.waitForResult();
    return this;
  }
}
