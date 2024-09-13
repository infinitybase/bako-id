import type { WalletUnlocked } from 'fuels';
import { ResolverContract, ResolverContractFactory } from '../../../src';

export class TestResolverContract extends ResolverContract {
  static async startup({
    owner,
    storageId,
  }: {
    owner: WalletUnlocked;
    storageId: string;
  }) {
    const contract = await TestResolverContract.deploy(owner);
    await contract.functions.constructor({ bits: storageId }).call();
    return new TestResolverContract(contract.id, owner);
  }

  static async deploy(wallet: WalletUnlocked) {
    const deployFn = await ResolverContractFactory.deploy(wallet);
    const { contract } = await deployFn.waitForResult();

    return contract;
  }

  async initialize(params: { storageId: string }) {
    const { storageId } = params;
    const callFn = await this.functions.constructor({ bits: storageId }).call();
    return callFn.waitForResult();
  }
}
