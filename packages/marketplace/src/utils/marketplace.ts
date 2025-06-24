import { TestAssetId, launchTestNode } from 'fuels/test-utils';

import type { BN, FunctionInvocationScope } from 'fuels';
import {
  MarketplaceFactory,
  ResolverMockFactory,
  type Marketplace,
} from '../artifacts/contracts';
import type {
  AdjustFeeTypeInput,
  WithdrawFeeEventOutput,
} from '../artifacts/contracts/Marketplace';

export const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>
) => {
  const result = await method.call();
  return result.waitForResult();
};

export const setup = async () => {
  const [feeAssetId] = TestAssetId.random(1);
  const walletsConfig = {
    assets: [TestAssetId.A, TestAssetId.B, feeAssetId],
  };

  const node = await launchTestNode({
    walletsConfig,
  });
  const [owner] = node.wallets;

  const resolverContract = await ResolverMockFactory.deploy(owner);
  const resolverContractId = resolverContract.contractId;
  const resolver = (await resolverContract.waitForResult()).contract;
  const marketplace = (
    await (
      await MarketplaceFactory.deploy(owner, {
        configurableConstants: {
          RESOLVER_CONTRACT_ID: resolverContractId,
        },
      })
    ).waitForResult()
  ).contract;

  const provider = node.provider;

  await callAndWait(
    marketplace.functions.initialize({
      Address: { bits: owner.address.toB256() },
    })
  );

  return {
    node,
    marketplace,
    provider,
    feeAssetId: feeAssetId.value,
    owner,
    resolver,
  };
};

export const registerAsset = async (
  marketplace: Marketplace,
  asset: string,
  fee: BN,
  withBakoIdFee: BN
) => {
  const {
    logs: [assetAddedEvent],
  } = await callAndWait(
    marketplace.functions.add_valid_asset({ bits: asset }, [fee, withBakoIdFee])
  );

  return assetAddedEvent;
};

export const adjustFee = async (
  marketplace: Marketplace,
  asset: string,
  fee: AdjustFeeTypeInput
) => {
  const {
    logs: [assetFeeAdjustedEvent],
  } = await callAndWait(marketplace.functions.adjust_fee({ bits: asset }, fee));

  return assetFeeAdjustedEvent;
};

export const createOrder = async (
  marketplace: Marketplace,
  itemAsset: string,
  price: { asset: string; amount: number }
) => {
  const {
    logs: [orderCreatedEvent],
  } = await callAndWait(
    marketplace.functions
      .create_order({ bits: price.asset }, price.amount)
      .callParams({
        forward: {
          amount: 1,
          assetId: itemAsset,
        },
      })
  );

  return orderCreatedEvent;
};

export const withdrawFees = async (
  marketplace: Marketplace,
  recipient: string,
  asset: string
): Promise<WithdrawFeeEventOutput> => {
  const {
    logs: [withdrawFeeEvent],
  } = await callAndWait(
    marketplace.functions.withdraw_fees({ bits: recipient }, { bits: asset })
  );

  return withdrawFeeEvent;
};
