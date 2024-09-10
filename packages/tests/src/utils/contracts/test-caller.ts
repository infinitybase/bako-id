import type { WalletUnlocked } from 'fuels';
import { TestContract, TestContractFactory } from '../../types';

export class TestCallerContract extends TestContract {
  static async startup(owner: WalletUnlocked, storageId: string) {
    const contract = await TestCallerContract.deploy(owner);

    const callFn = await contract.functions
      .test_set({ bits: storageId })
      .call();

    await callFn.waitForResult();

    return new TestCallerContract(contract.id, owner);
  }

  static async deploy(owner: WalletUnlocked) {
    const deployFn = await TestContractFactory.deploy(owner);
    const result = await deployFn.waitForResult();
    const { contract } = result;
    return contract;
  }
}
