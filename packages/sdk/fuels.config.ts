import * as dotenv from 'dotenv';
import { createConfig } from 'fuels';

dotenv.config();

export default createConfig({
  contracts: [
    '../sway/src/registry-contract',
    '../sway/src/metadata-contract',
    '../sway/src/resolver-contract',
    '../sway/src/storage-contract',
    '../sway/src/attestation-contract',
  ],
  forcBuildFlags: ['--release'],
  autoStartFuelCore: false,
  providerUrl: process.env.PROVIDER_URL,
  privateKey: process.env.PRIVATE_KEY,
  output: './src/types/sway',
});
