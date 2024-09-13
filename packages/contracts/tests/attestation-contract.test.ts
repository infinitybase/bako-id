import { Address, TransactionStatus } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';
import { AttestationContractFactory } from '../src';
import {
  TestAttestationContract,
  expectContainLogError,
  expectRequireRevertError,
  txParams,
} from './utils';

describe('[METHODS] Attestation Contract', () => {
  let attestation: TestAttestationContract;
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  beforeAll(async () => {
    node = await launchTestNode({
      walletsConfig: { count: 3 },
      contractsConfigs: [{ factory: AttestationContractFactory }],
    });
    const {
      contracts: [contract],
      wallets: [deployer],
    } = node;
    attestation = new TestAttestationContract(contract.id, deployer);
  });

  afterAll(() => {
    node.cleanup();
  });

  it('should initialize attestation contract', async () => {
    const [_, attester] = node.wallets;
    const { transactionResult } = await attestation.initialize({ attester });
    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should throw error trying to initialize attestation contract that is already initialized', async () => {
    const [_, attester] = node.wallets;

    try {
      const { transactionResult } = await attestation.initialize({ attester });
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'AttestationContractAlreadyInitialized');
    }
  });

  it('should return the attester address', async () => {
    const [_, attester] = node.wallets;
    const {
      value: { bits: attesterAddress },
    } = await attestation.functions.attester().get();

    expect(attesterAddress).toBe(attester.address.toB256());
  });

  it('should be able to set attester address only by the attester', async () => {
    const [owner, attester, newAttester] = node.wallets;

    const attestation = await TestAttestationContract.startup({
      owner,
      attester,
    });
    attestation.account = attester;
    const callFn = await attestation.functions
      .set_attester({ bits: newAttester.address.toB256() })
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);

    const {
      value: { bits: attesterAddress },
    } = await attestation.functions.attester().get();
    expect(attesterAddress).toBe(newAttester.address.toB256());
  });

  it('should throw error trying to set attester address by non-attester', async () => {
    const { wallets } = node;
    const [_, attester, fakeAttester] = wallets;

    try {
      attestation.account = fakeAttester;
      const callFn = await attestation.functions
        .set_attester({ bits: fakeAttester.address.toB256() })
        .txParams(txParams)
        .call();
      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'OnlyAttester');
    } finally {
      attestation.account = attester;
    }
  });

  it('should be able to attest and return attestation key', async () => {
    const input = {
      id: '0x1234567890',
      handle: 'my_handle',
      app: 'farcaster',
    };
    const callFn = await attestation.functions
      .attest(input)
      .txParams(txParams)
      .call();
    const { transactionResult, value } = await callFn.waitForResult();
    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(value).toBeDefined();
  });

  it('should verify by attestation key and return attestation hash', async () => {
    const input = {
      id: '0x1234567890',
      handle: 'my_handle',
      app: 'farcaster',
    };
    const { waitForResult } = await attestation.functions
      .attest(input)
      .txParams(txParams)
      .call();
    const { value: attestationKey } = await waitForResult();
    const { value: attestationHash } = await attestation.functions
      .verify(attestationKey)
      .get();
    expect(attestationHash).toBeDefined();
  });

  it('should return undefined when verifying non-existent attestation key', async () => {
    const randomSHA256 = Address.fromRandom().toB256();
    const { value: attestationHash } = await attestation.functions
      .verify(randomSHA256)
      .get();
    expect(attestationHash).toBeUndefined();
  });
});
