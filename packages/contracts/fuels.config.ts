import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
    './sway/src/registry-contract',
    './sway/src/metadata-contract',
    './sway/src/storage-contract',
    './sway/src/resolver-contract',
    './sway/src/attestation-contract',
    './tests/fixtures/test-contract',
  ],
  forcBuildFlags: ['--release'],
  autoStartFuelCore: false,
  output: './src/sway',
});
