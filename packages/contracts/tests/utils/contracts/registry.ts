import { type WalletUnlocked, bn } from 'fuels';
import {
  RegistryContract,
  RegistryContractFactory,
  type StorageContract,
} from '../../../src';
import { domainPrices, txParams } from '../wallet';

export class TestRegistryContract extends RegistryContract {
  static async startup({
    owner,
    storageId,
    attestationId,
  }: {
    owner: WalletUnlocked;
    storageId: string;
    attestationId: string;
  }) {
    const contract = await TestRegistryContract.deploy(owner);

    const contractAbi = new TestRegistryContract(contract.id, owner);
    await contractAbi.initialize({ owner, storageId, attestationId });

    return contractAbi;
  }

  static async deploy(owner: WalletUnlocked) {
    const deployFn = await RegistryContractFactory.deploy(owner);
    const { contract } = await deployFn.waitForResult();

    return contract;
  }

  async initialize(params: {
    owner: WalletUnlocked;
    storageId: string;
    attestationId: string;
  }) {
    const { storageId, attestationId, owner } = params;
    const callFn = await this.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: storageId },
        { bits: attestationId }
      )
      .call();

    return callFn.waitForResult();
  }

  async register(params: {
    domain: string;
    period: number;
    storageAbi: StorageContract;
    address?: string;
    attestationKey?: string;
    calculateAmount?: boolean;
  }) {
    const {
      domain,
      period,
      address,
      storageAbi,
      attestationKey,
      calculateAmount = true,
    } = params;
    const amount = domainPrices(domain, period);
    const callBuilder = this.functions.register(
      domain,
      address ?? this.account!.address.toB256(),
      period,
      attestationKey
    );

    if (calculateAmount) {
      callBuilder.callParams({
        forward: { amount, assetId: this.provider.getBaseAssetId() },
      });
    } else {
      callBuilder.callParams({
        forward: {
          amount: bn(0),
          assetId: this.provider.getBaseAssetId(),
        },
      });
    }

    const fn = await callBuilder
      .addContracts([storageAbi])
      .txParams(txParams)
      .call();
    return fn.waitForResult();
  }
}
