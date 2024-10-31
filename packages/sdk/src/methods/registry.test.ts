import { ManagerFactory, RegistryFactory } from '@bako-id/contracts';
import { WalletUnlocked } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { RegistryContract } from '../index';
import { InvalidDomainError, NotFoundBalanceError, randomName } from '../utils';

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
    }
  );

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
