import { Address, Provider, Wallet, type WalletUnlocked, bn } from 'fuels';
import { createFakeWallet } from '../test';
import { attest, verify } from './attestation';

const { PROVIDER_URL, ATTESTER_WALLET, PRIVATE_KEY } = process.env;

describe('Test Attestation', () => {
  let attester: WalletUnlocked;
  let provider: Provider;
  let wallet: WalletUnlocked;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);

    const mainWallet = Wallet.fromPrivateKey(PRIVATE_KEY!, provider);
    attester = Wallet.fromPrivateKey(ATTESTER_WALLET!, provider);
    wallet = await createFakeWallet(provider, '0.1');
    await mainWallet
      .transfer(attester.address, bn(10_000_000))
      .then((a) => a.waitForResult());
  });

  it('should attest an attestation', async () => {
    const attestationHash = await attest({
      data: {
        id: '0x322',
        app: 'farcaster',
        handle: 'my_handle',
      },
      attester,
    });

    expect(attestationHash).toBeDefined();
  });

  it('should error on attesting with a non-attester', async () => {});

  it('should verify an attestation by attestation key and ', async () => {
    const attestation = await attest({
      data: {
        id: '0x123',
        app: 'farcaster',
        handle: 'my_handle',
      },
      attester,
    });

    const attestationHash = await verify(attestation, {
      account: wallet,
    });

    expect(attestationHash).toBeDefined();
  });

  it('should return undefined if the attestation is not found', async () => {
    const fakeHash = Address.fromRandom().toB256();

    const attestationHash = await verify(fakeHash, {
      account: wallet,
    });

    expect(attestationHash).toBeUndefined();
  });
});
