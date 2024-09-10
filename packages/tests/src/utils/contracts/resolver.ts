import type { WalletUnlocked } from 'fuels';
import { ResolverContract, ResolverContractFactory } from '../../types';

export class TestResolverContract extends ResolverContract {
  static async startup({
    owner,
    storageId,
  }: {
    owner: WalletUnlocked;
    storageId: string;
  }) {
    const contract = await TestResolverContract.deploy(owner);

    const callFn = await contract.functions
      .constructor({ bits: storageId })
      .call();
    await callFn.waitForResult();

    return new TestResolverContract(contract.id, owner);
  }

  static async deploy(wallet: WalletUnlocked) {
    const deployFn = await ResolverContractFactory.deploy(wallet);
    const { contract } = await deployFn.waitForResult();

    return contract;
  }
}
