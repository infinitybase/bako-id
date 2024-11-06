import {
  ManagerFactory,
  NftFactory,
  RegistryFactory,
  ResolverFactory,
} from '@bako-id/contracts';
import { type Account, ZeroBytes32, getRandomB256 } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { randomName } from '../utils';
import { RegistryContract } from './registry';
import { ResolverContract } from './resolver';

describe('Test resolver', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  beforeAll(async () => {
    node = await launchTestNode({
      contractsConfigs: [
        { factory: ResolverFactory },
        { factory: RegistryFactory },
        { factory: ManagerFactory },
        { factory: NftFactory },
      ],
    });

    const { contracts } = node;
    const [resolver, registry, manager, nft] = contracts;

    const nftCall = await nft.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await nftCall.waitForResult();

    const managerCall = await manager.functions
      .constructor({ ContractId: { bits: registry.id.toB256() } })
      .call();
    await managerCall.waitForResult();

    const registerCall = await registry.functions
      .constructor({ bits: manager.id.toB256() }, { bits: nft.id.toB256() })
      .call();
    await registerCall.waitForResult();

    const resolverCall = await resolver.functions
      .constructor({ bits: manager.id.toB256() })
      .call();
    await resolverCall.waitForResult();
  });

  afterAll(() => {
    node.cleanup();
  });

  const register = async (options: {
    contractId?: string;
    accountResolver?: string;
    account?: Account;
    domain: string;
  }) => {
    const { account, contractId, domain, accountResolver } = options;
    const {
      contracts: [, registry],
      wallets: [wallet],
    } = node;
    const owner = account ?? wallet;
    const resolverAddress =
      accountResolver ?? contractId ?? owner.address.toB256();
    const contract = new RegistryContract(registry.id.toB256(), owner);
    await contract.register({
      domain,
      period: 1,
      resolver: resolverAddress,
    });
    return {
      resolverAddress,
      ownerAddress: owner.address.toB256(),
    };
  };

  it('should resolve a domain correctly', async () => {
    const {
      contracts: [resolverAbi],
      wallets: [wallet],
    } = node;
    const contract = new ResolverContract(resolverAbi.id.toB256(), wallet);

    const domain = randomName();
    const { resolverAddress, ownerAddress } = await register({ domain });

    const resolver = await contract.addr(domain);
    expect(resolver?.Address?.bits).toBe(resolverAddress);

    const owner = await contract.owner(domain);
    expect(owner?.Address?.bits).toBe(ownerAddress);

    const name = await contract.name(resolverAddress);
    expect(name).toBe(domain);
  });

  it('should not resolve a domain when not registered', async () => {
    const {
      contracts: [resolverAbi],
      wallets: [wallet],
    } = node;
    const contract = new ResolverContract(resolverAbi.id.toB256(), wallet);

    const address = await contract.addr('not-registered');
    expect(address).toBeUndefined();

    const owner = await contract.owner('not-registered');
    expect(owner).toBeUndefined();

    const name = await contract.name(ZeroBytes32);
    expect(name).toBeUndefined();
  });

  it('should resolve a domain registered to a contract', async () => {
    const {
      contracts: [resolverAbi],
      wallets: [wallet],
    } = node;

    const contractId = resolverAbi.id.toB256();
    const contract = new ResolverContract(contractId, wallet);

    const domain = 'bako_resolver';
    const { resolverAddress, ownerAddress } = await register({
      domain,
      contractId,
    });

    const resolver = await contract.addr(domain);
    expect(resolver?.ContractId?.bits).toBe(resolverAddress);

    const owner = await contract.owner(domain);
    expect(owner?.Address?.bits).toBe(ownerAddress);

    const name = await contract.name(resolverAddress);
    expect(name).toBe(domain);
  });

  it('should should resolve the first domain registered', async () => {
    const {
      contracts: [resolverAbi],
      wallets: [wallet],
    } = node;

    const constractId = resolverAbi.id.toB256();
    const contract = new ResolverContract(constractId, wallet);

    const [firstDomain, secondDomain] = ['first', 'second'];

    const accountResolver = getRandomB256();
    const { resolverAddress } = await register({
      domain: firstDomain,
      accountResolver,
    });
    await register({ domain: secondDomain, accountResolver });

    const name = await contract.name(resolverAddress);
    expect(name).toBe(firstDomain);
  });
});
