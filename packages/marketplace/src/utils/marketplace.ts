import { TestAssetId, launchTestNode } from 'fuels/test-utils';

import type { BN, FunctionInvocationScope } from 'fuels';
import { type Marketplace, MarketplaceFactory } from '../artifacts/contracts';

export const callAndWait = async <T extends unknown[], R>(
  method: FunctionInvocationScope<T, R>,
) => {
  const result = await method.call();
  return result.waitForResult();
};

export const setup = async () => {
  const [feeAssetId] = TestAssetId.random(1);
  const node = await launchTestNode({
    contractsConfigs: [{ factory: MarketplaceFactory }],
    walletsConfig: {
      assets: [TestAssetId.A, TestAssetId.B, feeAssetId],
    },
  });

  const [contract] = node.contracts;
  const [owner] = node.wallets;

  const marketplace = contract as Marketplace;
  const provider = node.provider;

  await callAndWait(
    marketplace.functions.initialize({
      Address: { bits: owner.address.toB256() },
    }),
  );

  return { node, marketplace, provider, feeAssetId: feeAssetId.value, owner };
};

export const registerAsset = async (
  marketplace: Marketplace,
  asset: string,
  fee: BN,
) => {
  const {
    logs: [assetAddedEvent],
  } = await callAndWait(
    marketplace.functions.add_valid_asset({ bits: asset }, fee),
  );

  return assetAddedEvent;
};

export const adjustFee = async (
  marketplace: Marketplace,
  asset: string,
  fee: BN,
) => {
  const {
    logs: [assetFeeAdjustedEvent],
  } = await callAndWait(marketplace.functions.adjust_fee({ bits: asset }, fee));

  return assetFeeAdjustedEvent;
};

export const createOrder = async (
  marketplace: Marketplace,
  itemAsset: string,
  price: { asset: string; amount: number },
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
      }),
  );

  return orderCreatedEvent;
};
