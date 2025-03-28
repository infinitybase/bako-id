import {
  ManagerFactory,
  NftFactory,
  RegistryFactory,
  getContractId,
} from '@bako-id/contracts';
import {
  TransactionStatus,
  WalletUnlocked,
  getRandomB256,
  hashMessage,
} from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { RegistryContract } from '../methods/registry';
import { InvalidDomainError, NotFoundBalanceError, randomName } from '../utils';
import { MetadataKeys } from './types';

jest.mock('@bako-id/contracts', () => ({
  ...jest.requireActual('@bako-id/contracts'),
  getContractId: jest.fn(),
}));

describe('Test Registry', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  beforeAll(async () => {
    node = await launchTestNode({
      contractsConfigs: [
        { factory: RegistryFactory },
        { factory: ManagerFactory },
        { factory: NftFactory },
      ],
    });

    const {
      contracts,
      wallets: [owner],
    } = node;
    const [registry, manager, nft] = contracts;

    (getContractId as jest.Mock).mockImplementation((_provider, contract) => {
      if (contract === 'registry') {
        return registry.id.toB256();
      }
      if (contract === 'manager') {
        return manager.id.toB256();
      }
      if (contract === 'nft') {
        return nft.id.toB256();
      }
      throw new Error('Invalid contract');
    });

    const nftCall = await nft.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } },
      )
      .call();
    await nftCall.waitForResult();

    const managerCall = await manager.functions
      .constructor(
        { Address: { bits: owner.address.toB256() } },
        { ContractId: { bits: registry.id.toB256() } },
      )
      .call();
    await managerCall.waitForResult();

    const registerCall = await registry.functions
      .constructor(
        { bits: owner.address.toB256() },
        { bits: manager.id.toB256() },
        { bits: nft.id.toB256() },
      )
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

    const resolver = wallet.address.toB256();
    const domain = `bako_${randomName(3)}`;

    const result = await contract.register({
      domain,
      period: 1,
      resolver,
    });
    const mintedToken = result.transactionResult.mintedAssets[0];

    expect(mintedToken).toBeDefined();
    expect(mintedToken.subId).toBe(hashMessage(domain));

    const { image } = await contract.token(domain);
    expect(image).toBeDefined();
    expect(image).toBe(`https://assets.bako.id/${domain}`);
  });

  it('should set metadata to domain', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const metadata = {
      [MetadataKeys.CONTACT_EMAIL]: 'random@gmail.com',
      [MetadataKeys.CONTACT_NICKNAME]: 'random',
      [MetadataKeys.CONTACT_PHONE]: '123456789',
      [MetadataKeys.LINK_BLOG]: 'https://random.com',
    };

    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const resolver = wallet.address.toB256();
    const domain = `bako_${randomName(3)}`;

    await contract.register({
      domain,
      period: 1,
      resolver,
    });

    const metadataSet = await contract.setMetadata(domain, metadata);
    const metadatasResult = await contract.getMetadata(domain);

    expect(metadataSet).toBe(true);
    expect(metadatasResult).toEqual(metadata);
  });

  it('should register two domain with the same address', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const domain1 = `bako_${randomName(3)}`;
    const domain2 = `bako_${randomName(3)}`;
    const resolver = getRandomB256();
    const result1 = await contract.register({
      domain: domain1,
      period: 1,
      resolver,
    });

    const mintedToken_1 = result1.transactionResult.mintedAssets[0];

    expect(mintedToken_1).toBeDefined();
    expect(mintedToken_1.subId).toBe(hashMessage(domain1));

    const result2 = await contract.register({
      domain: domain2,
      period: 1,
      resolver,
    });
    const mintedToken_2 = result2.transactionResult.mintedAssets[0];

    expect(mintedToken_2).toBeDefined();
    expect(mintedToken_2.subId).toBe(hashMessage(domain2));
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

  it('should execute methods correctly without an account', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
      provider,
    } = node;

    const domain = randomName();
    const contract = new RegistryContract(registry.id.toB256(), wallet);
    const baseAssetId = await provider.getBaseAssetId();
    await contract.register({
      domain,
      period: 1,
      resolver: baseAssetId,
    });
    await contract.setMetadata(domain, {
      [MetadataKeys.CONTACT_BIO]: 'bio',
    });

    const contractWithoutAccount = new RegistryContract(
      registry.id.toB256(),
      provider,
    );

    const { fee, price } = await contractWithoutAccount.simulate({
      domain: randomName(),
      period: 1,
    });
    expect(fee).toBeDefined();
    expect(price).toBeDefined();

    const { image } = await contractWithoutAccount.token(domain);
    expect(image).toBeDefined();
    expect(image).toBe(`https://assets.bako.id/${domain}`);

    const metadata = await contractWithoutAccount.getMetadata(domain);
    expect(metadata[MetadataKeys.CONTACT_BIO]).toBe('bio');

    await expect(() =>
      contractWithoutAccount.register({
        domain: randomName(),
        period: 1,
        resolver: baseAssetId,
      }),
    ).rejects.toThrow('Account is required to register a domain');

    await expect(() =>
      contractWithoutAccount.setMetadata(randomName(), {
        [MetadataKeys.CONTACT_BIO]: 'bio',
      }),
    ).rejects.toThrow('Account is required to setMetadata');
  });

  it('should get ttl and timestamp correctly', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
      provider,
    } = node;

    const domain = randomName();
    const period = 1;
    const contract = new RegistryContract(registry.id.toB256(), wallet);
    const {
      transactionResult: { date },
    } = await contract.register({
      domain,
      period,
      resolver: await provider.getBaseAssetId(),
    });

    const { ttl, timestamp } = await contract.getDates(domain);
    const expectedTtl = new Date(
      date!.getFullYear() + period,
      date!.getMonth(),
      date!.getDate(),
    );
    expectedTtl.setHours(0, 0, 0, 0);
    date!.setHours(0, 0, 0, 0);

    expect(ttl).toEqual(expectedTtl);
    expect(timestamp).toEqual(date);

    await expect(() => contract.getDates('not_found')).rejects.toThrow(
      'Domain not found',
    );
  });

  it('should change owner correctly', async () => {
    const {
      contracts: [registry, manager],
      wallets: [owner, newOwner],
    } = node;

    const domain = randomName();
    const contract = new RegistryContract(registry.id.toB256(), owner);
    await contract.register({
      domain,
      period: 1,
      resolver: owner.address.toB256(),
    });

    const newAddress = newOwner.address.toB256();
    const result = await contract.changeOwner({
      domain,
      address: newAddress,
    });

    expect(result.status).toBe(TransactionStatus.success);

    const { value: onChainRecord } = await manager.functions
      .get_owner(domain)
      .get();
    expect(onChainRecord?.Address?.bits).toBe(newAddress);

    await expect(() =>
      contract.changeOwner({
        domain,
        address: newAddress,
      }),
    ).rejects.toThrow(/NotOwner/);
  });

  it('should change resolver correctly', async () => {
    const {
      contracts: [registry, manager],
      wallets: [owner, newResolver],
    } = node;

    const domain = randomName();
    let contract = new RegistryContract(registry.id.toB256(), owner);
    await contract.register({
      domain,
      period: 1,
      resolver: owner.address.toB256(),
    });

    const newAddress = newResolver.address.toB256();
    const result = await contract.changeResolver({
      domain,
      address: newAddress,
    });

    expect(result.status).toBe(TransactionStatus.success);

    const { value: onChainRecord } = await manager.functions
      .get_resolver(domain)
      .get();
    expect(onChainRecord?.Address?.bits).toBe(newAddress);

    await expect(() =>
      contract.changeResolver({
        domain,
        address: newAddress,
      }),
    ).rejects.toThrow(/ResolverAlreadyInUse/);

    contract = new RegistryContract(registry.id.toB256(), newResolver);

    await expect(() =>
      contract.changeResolver({
        domain,
        address: newAddress,
      }),
    ).rejects.toThrow(/NotOwner/);
  });
});
