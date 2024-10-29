import { ManagerFactory, RegistryFactory } from '@bako-id/contracts';
import {
  TransactionStatus,
  WalletUnlocked,
  ZeroBytes32,
  getMintedAssetId,
  sha256,
  toUtf8Bytes,
} from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { InvalidDomainError, NotFoundBalanceError, randomName } from '../utils';
import { RegistryContract } from './registry';

describe('Test registry', () => {
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

  it('should register a name correctly', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const domain = 'test';
    const { transactionResult, assetId } = await contract.register({
      domain,
      period: 1,
      resolver: wallet.address.toB256(),
    });

    const expectedAssetId = getMintedAssetId(
      registry.id.toB256(),
      sha256(toUtf8Bytes(domain))
    );
    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(assetId).toBe(expectedAssetId);

    const token = await wallet.getBalance(assetId);
    expect(token).toBeDefined();
    expect(token.toNumber()).toBe(1);
  });

  it('should error when register same domain', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const domain = randomName();

    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const register = () =>
      contract.register({
        domain,
        period: 1,
        resolver: ZeroBytes32,
      });

    const { transactionResult } = await register();
    expect(transactionResult.status).toBe(TransactionStatus.success);
    await expect(register).rejects.toThrow(/AlreadyMinted/);
  });

  it('should register domain with special characters', async () => {
    const {
      contracts: [registry],
      wallets: [wallet],
    } = node;
    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const domain = `bako_${randomName(3)}`;
    const { transactionResult } = await contract.register({
      domain,
      period: 1,
      resolver: wallet.address.toB256(),
    });
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should error when register domain without balance', async () => {
    const {
      contracts: [registry],
      provider,
    } = node;
    const wallet = WalletUnlocked.generate({ provider });
    const contract = new RegistryContract(registry.id.toB256(), wallet);

    const domain = randomName(3);

    await expect(() =>
      contract.register({
        domain,
        period: 1,
        resolver: wallet.address.toB256(),
      })
    ).rejects.toBeInstanceOf(NotFoundBalanceError);
  });
});
