import type { WalletUnlocked } from 'fuels';
import { AttestationContract, AttestationContractFactory } from '../../types';

export class TestAttestationContract extends AttestationContract {
  static async startup({
    owner,
    attester,
  }: {
    owner: WalletUnlocked;
    attester: WalletUnlocked;
  }) {
    const contract = await TestAttestationContract.deploy(owner);
    await contract.initialize({ attester });
    return new TestAttestationContract(contract.id, owner);
  }

  static async deploy(owner: WalletUnlocked) {
    const deployFn = await AttestationContractFactory.deploy(owner);
    const { contract } = await deployFn.waitForResult();

    return new TestAttestationContract(contract.id, owner);
  }

  async initialize(params: { attester: WalletUnlocked }) {
    const { attester } = params;
    const callFn = await this.functions
      .constructor({ bits: attester.address.toB256() })
      .call();

    return callFn.waitForResult();
  }
}
