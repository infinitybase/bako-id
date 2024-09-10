import { Address, Provider, TransactionStatus, WalletUnlocked } from 'fuels';
import {
  TestAttestationContract,
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  fundWallet,
  txParams,
} from './utils';

describe('[METHODS] Attestation Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  let attestation: TestAttestationContract;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);

    attestation = await TestAttestationContract.deploy(wallet);
  });

  it('should initialize attestation contract', async () => {
    const { transactionResult } = await attestation.initialize({
      attester: wallet,
    });

    expect(transactionResult.status).toBe(TransactionStatus.success);
  });

  it('should throw error trying to initialize attestation contract that is already initialized', async () => {
    try {
      const { transactionResult } = await attestation.initialize({
        attester: wallet,
      });

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'AttestationContractAlreadyInitialized');
    }
  });

  it('should return the attester address', async () => {
    const {
      value: { bits: attesterAddress },
    } = await attestation.functions.attester().get();

    expect(attesterAddress).toBe(wallet.address.toB256());
  });

  it('should be able to set attester address only by the attester', async () => {
    const newAttester = Address.fromRandom().toB256();
    const attestation = await TestAttestationContract.startup({
      attester: wallet,
      owner: wallet,
    });

    const callFn = await attestation.functions
      .set_attester({ bits: newAttester })
      .txParams(txParams)
      .call();

    const { transactionResult } = await callFn.waitForResult();

    const {
      value: { bits: attesterAddress },
    } = await attestation.functions.attester().get();

    expect(transactionResult.status).toBe(TransactionStatus.success);
    expect(attesterAddress).toBe(newAttester);
  });

  it('should throw error trying to set attester address by non-attester', async () => {
    const fakeAttester = WalletUnlocked.generate({ provider });
    await fundWallet(fakeAttester);

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
      attestation.account = wallet;
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
