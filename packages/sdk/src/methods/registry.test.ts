import { ManagerFactory, RegistryFactory } from '@bako-id/contracts';
import { getRandomB256, hashMessage, WalletUnlocked } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { RegistryContract } from '../index';
import { InvalidDomainError, NotFoundBalanceError, randomName } from '../utils';
import { OffChainSync } from './offChainSync';

describe('Test Registry', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  beforeAll(async () => {
    node = await launchTestNode({
      contractsConfigs: [
        { factory: RegistryFactory },
        { factory: ManagerFactory },
      ],
    });

    const { contracts } = node;
    const [registry, manager] = contracts;

    const managerCall = await manager.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await managerCall.waitForResult();

    const registerCall = await registry.functions
      .constructor({ bits: manager.id.toB256() })
      .call();
    await registerCall.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  it.each(['bako@', '#bako', 'bako name', 'bakONamE'])(
    'should error when register domain with invalid character %s',
    async (domain) => {
      const {
        contracts: [registry],
        wallets: [wallet],
      } = node;
      const contract = new RegistryContract(registry.id.toB256(), wallet);
      const invalidSuffix = contract.register({
        domain,
        period: 1,
        resolver: wallet.address.toB256(),
      });
      await expect(invalidSuffix).rejects.toBeInstanceOf(InvalidDomainError);
    },
  );

  it('should register domain', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const contract = new RegistryContract(registry.id.toB256(), wallet);
    const sync = await OffChainSync.create(wallet.provider);

    const resolver = wallet.address.toB256();
    const domain = `bako_${randomName(3)}`;

    expect(sync.getDomain(resolver)).toBeUndefined();
    expect(sync.getResolver(domain)).toBeUndefined();

    const result = await contract.register({
      domain,
      period: 1,
      resolver,
    });
    const mintedToken = result.transactionResult.mintedAssets[0];

    await sync.syncData();

    expect(mintedToken).toBeDefined();
    expect(mintedToken.subId).toBe(hashMessage(domain));
    expect(sync.getDomain(resolver)).toBe(domain);
    expect(sync.getResolver(domain)).toBe(resolver);
    expect(sync.getRecords(resolver).length).toBe(1);
  });

  it('should register two domain with the same address', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const contract = new RegistryContract(registry.id.toB256(), wallet);

    let sync = await OffChainSync.create(wallet.provider);
    const domain_1 = `bako_${randomName(3)}`;
    const domain_2 = `bako_${randomName(3)}`;
    const resolver = getRandomB256();
    const result_1 = await contract.register({
      domain: domain_1,
      period: 1,
      resolver,
    });

    const mintedToken_1 = result_1.transactionResult.mintedAssets[0];

    await sync.syncData();

    expect(mintedToken_1).toBeDefined();
    expect(sync.getRecords(resolver).length).toBe(1);
    expect(sync.getDomain(resolver)).toBe(domain_1);
    expect(sync.getResolver(domain_1)).toBe(resolver);
    expect(mintedToken_1.subId).toBe(hashMessage(domain_1));

    const result_2 = await contract.register({
      domain: domain_2,
      period: 1,
      resolver,
    });

    await sync.syncData();

    const mintedToken_2 = result_2.transactionResult.mintedAssets[0];

    expect(mintedToken_2).toBeDefined();
    // just retorn the first domain registered
    expect(sync.getDomain(resolver)).toBe(domain_1);
    expect(sync.getRecords(resolver).length).toBe(2);
    expect(sync.getResolver(domain_2)).toBe(resolver);
    expect(mintedToken_2.subId).toBe(hashMessage(domain_2));
  });

  it('should register domain with special characters', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const contract = new RegistryContract(registry.id.toB256(), wallet);
    const result = await contract.register({
      domain: `bako_${randomName(3)}`,
      period: 1,
      resolver: wallet.address.toB256(),
    });
    expect(result.transactionResult).toBeDefined();
  });

  it('should error when register domain without balance', async () => {
    const {
      contracts: [registry],
      provider,
    } = node;

    const wallet = WalletUnlocked.generate({ provider });
    const contract = new RegistryContract(registry.id.toB256(), wallet);
    const registerResult = contract.register({
      domain: `bako_${randomName(3)}`,
      period: 1,
      resolver: wallet.address.toB256(),
    });

    await expect(registerResult).rejects.toBeInstanceOf(NotFoundBalanceError);
  });

  it('should simulate handle cost', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;

    const domain = randomName();
    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const { fee, price } = await contract.simulate({
      domain,
      period: 1,
    });

    expect(fee).toBeDefined();
    expect(price).toBeDefined();
  });
});
