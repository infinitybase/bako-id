import {
  Address,
  Provider,
  TransactionStatus,
  type WalletUnlocked,
} from 'fuels';
import {
  WALLET_PRIVATE_KEYS,
  createWallet,
  expectContainLogError,
  expectRequireRevertError,
  setupContractsAndDeploy,
  txParams,
} from './utils';

describe('[METHODS] Attestation Contract', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;
  let contracts: Awaited<ReturnType<typeof setupContractsAndDeploy>>;
  let address: string;

  beforeAll(async () => {
    provider = await Provider.create('http://localhost:4000/v1/graphql');
    wallet = createWallet(provider, WALLET_PRIVATE_KEYS.FAKE);
    address = wallet.address.toB256();

    contracts = await setupContractsAndDeploy(wallet);
  });

  it('should initialize attestation contract', async () => {
    const { attestation } = contracts;

    try {
      const callFn = await attestation.functions
        .constructor({ bits: address })
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.success);
    } catch (err) {
      console.error(err.metadata);
    }
  });

  it('should throw error trying to initialize attestation contract that is already initialized', async () => {
    const { attestation } = contracts;

    try {
      await attestation.functions
        .constructor({ bits: address })
        .txParams(txParams)
        .call();

      const callFn = await attestation.functions
        .constructor({ bits: address })
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();
      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'AttestationContractAlreadyInitialized');
    }
  });

  it('should return the attester address', async () => {
    const { attestation } = contracts;

    const {
      value: { bits: attesterAddress },
    } = await attestation.functions.attester().get();

    expect(attesterAddress).toBe(address);
  });

  it('should be able to set attester address only by the attester', async () => {
    const { attestation } = contracts;

    const newAddress = Address.fromRandom().toB256();

    try {
      const callFn = await attestation.functions
        .set_attester({ bits: newAddress })
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();

      const {
        value: { bits: attesterAddress },
      } = await attestation.functions.attester().get();

      expect(transactionResult.status).toBe(TransactionStatus.success);
      expect(attesterAddress).toBe(newAddress);
    } catch (error) {
      console.error(error.metadata);
    }
  });

  it('should throw error trying to set attester address by non-attester', async () => {
    const { attestation } = contracts;

    const newAddress = Address.fromRandom().toB256();

    try {
      const callFn = await attestation.functions
        .set_attester({ bits: newAddress })
        .txParams(txParams)
        .call();

      const { transactionResult } = await callFn.waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.failure);
    } catch (error) {
      expectRequireRevertError(error);
      expectContainLogError(error, 'OnlyAttester');
    }
  });

  it('should be able to attest and return attestation key', async () => {
    const { attestation } = contracts;

    const input = {
      id: '0x1234567890',
      handle: 'my_handle',
      app: 'farcaster',
    };

    try {
      const callFn = await attestation.functions
        .attest(input)
        .txParams(txParams)
        .call();

      const { transactionResult, value } = await callFn.waitForResult();

      expect(transactionResult.status).toBe(TransactionStatus.success);
      expect(value).toBeDefined();
    } catch (error) {
      console.error(error);
    }
  });

  it('should verify by attestation key and return attestation hash', async () => {
    const { attestation } = contracts;

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

    try {
      const { value: attestationHash } = await attestation.functions
        .verify(attestationKey)
        .get();

      expect(attestationHash).toBeDefined();
    } catch (error) {
      console.error(error);
    }
  });

  it('should return undefined when verifying non-existent attestation key', async () => {
    const { attestation } = contracts;

    const randomSHA256 = Address.fromRandom().toB256();

    try {
      const { value: attestationHash } = await attestation.functions
        .verify(randomSHA256)
        .get();

      expect(attestationHash).toBeUndefined();
    } catch (error) {
      console.error(error);
    }
  });
});
