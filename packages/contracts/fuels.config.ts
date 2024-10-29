import dotenv from 'dotenv';
import { createConfig } from 'fuels';

dotenv.config();

export default createConfig({
  workspace: './sway',
  forcBuildFlags: ['--release'],
  autoStartFuelCore: false,
  output: './src/artifacts',
  privateKey: process.env.PRIVATE_KEY,
  providerUrl: process.env.PROVIDER_URL,
});
