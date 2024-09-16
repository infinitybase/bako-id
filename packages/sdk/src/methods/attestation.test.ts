import { Address, Provider, Wallet, type WalletUnlocked } from 'fuels';
import { createFakeWallet } from '../test';
import { attest, verify } from './attestation';

const { PROVIDER_URL, TEST_WALLET } = process.env;
describe('Test Attestation', () => {
  let wallet: WalletUnlocked;
  let provider: Provider;

  beforeAll(async () => {
    provider = await Provider.create(PROVIDER_URL!);

    const mainWallet = Wallet.fromPrivateKey(TEST_WALLET!, provider);
    wallet = await createFakeWallet(provider, mainWallet, '1.1');
  });

  it('should attest an attestation', async () => {
    const attestationHash = await attest({
      data: {
        id: '0x123',
        app: 'farcaster',
        handle: 'my_handle',
      },
      attester: wallet,
    });

    expect(attestationHash).toBeDefined();
  });

  it('should verify an attestation by attestation key and ', async () => {
    const attestation = await attest({
      data: {
        id: '0x123',
        app: 'farcaster',
        handle: 'my_handle',
      },
      attester: wallet,
    });

    const attestationHash = await verify(attestation, {
      account: wallet,
    });

    console.log(attestation);
    console.log(attestationHash);
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
