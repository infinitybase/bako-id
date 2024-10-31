import type { WalletUnlocked } from 'fuels';
import { TestContract, TestContractFactory } from '../../../src';

export class TestCallerContract extends TestContract {
  static async startup(owner: WalletUnlocked, storageId: string) {
    const contract = await TestCallerContract.deploy(owner);
    await contract.initialize({ storageId });
    return new TestCallerContract(contract.id, owner);
  }

  static async deploy(owner: WalletUnlocked) {
    const deployFn = await TestContractFactory.deploy(owner);
    const result = await deployFn.waitForResult();
    const { contract } = result;
    return new TestCallerContract(contract.id, owner);
  }

  async initialize(params: { storageId: string }) {
    const { storageId } = params;
    const callFn = await this.functions.test_set({ bits: storageId }).call();
    return callFn.waitForResult();
  }
}
