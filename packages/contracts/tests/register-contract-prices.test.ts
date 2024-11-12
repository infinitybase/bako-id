import { TransactionStatus, bn } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import {
  Manager,
  ManagerFactory,
  Nft,
  NftFactory,
  Registry,
  RegistryFactory,
} from '../src';
import {
  domainPrices,
  expectContainLogError,
  expectRequireRevertError,
  randomName,
} from './utils';

describe('[PRICES] Registry Contract', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let manager: Manager;
  let registry: Registry;
  let nft: Nft;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 2 },
      contractsConfigs: [
        { factory: ManagerFactory },
        { factory: RegistryFactory },
        { factory: NftFactory },
      ],
    });

    const {
      contracts: [managerAbi, registryAbi, nftAbi],
      wallets: [owner],
    } = node;

    manager = new Manager(managerAbi.id, owner);
    registry = new Registry(registryAbi.id, owner);
    nft = new Nft(nftAbi.id, owner);

    const nftCall = await nft.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await nftCall.waitForResult();

    const { waitForResult } = await registry.functions
      .constructor({ bits: manager.id.toB256() }, { bits: nftAbi.id.toB256() })
      .call();
    await waitForResult();

    const managerCall = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } }
      )
      .call();
    await managerCall.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should error register with invalid amount', async () => {
    try {
      const { wallets, provider } = node;
      const [owner] = wallets;
      const name = randomName();
      const price = domainPrices(name);

      const { waitForResult: waitForRegister } = await registry.functions
        .register(
          name,
          {
            Address: { bits: owner.address.toB256() },
          },
          bn(1)
        )
        .callParams({
          forward: {
            assetId: provider.getBaseAssetId(),
            amount: price.sub(10),
          },
        })
        .addContracts([manager])
        .call();
      const { transactionResult } = await waitForRegister();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (e) {
      expectRequireRevertError(e);
      expectContainLogError(e, 'InvalidAmount');
    }
  });

  it.each([3, 4, 10])(
    'should register domain with %d chars',
    async (domainLength) => {
      const { wallets, provider } = node;
      const [owner] = wallets;
      const name = randomName(domainLength);

      const price = domainPrices(name);

      const { waitForResult: waitForRegister } = await registry.functions
        .register(
          name,
          {
            Address: { bits: owner.address.toB256() },
          },
          bn(1)
        )
        .callParams({
          forward: { assetId: provider.getBaseAssetId(), amount: price },
        })
        .addContracts([manager, nft])
        .call();
      const { transactionResult } = await waitForRegister();

      expect(transactionResult.status).toBe(TransactionStatus.success);
    }
  );

  it.each([
    [3, 2, '0.01'],
    [4, 2, '0.002'],
    [10, 2, '0.0004'],
    [3, 7, '0.035'],
    [4, 7, '0.007'],
    [10, 7, '0.0014'],
  ])(
    'should return right price for domain with %d chars and %d year',
    async (domainLength, years, price) => {
      const domain = randomName(domainLength);
      const testPrice = domainPrices(domain, years);
      expect(bn.parseUnits(price).toString()).toBe(testPrice.toString());
    }
  );
});
