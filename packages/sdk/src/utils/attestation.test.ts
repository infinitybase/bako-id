import { Attestation } from './attestation';

describe('Attestation Generation', () => {
  test('Attestation hash generation', () => {
    const attestationHash = Attestation.generateHash({
      id: "0x123",
      app: "farcaster",
      handle: "my_handle",
    });
    console.log(attestationHash);
    expect(attestationHash).toBeDefined();
  });
});
