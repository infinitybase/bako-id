import { createConfig } from 'fuels';

export default createConfig({
  workspace: './sway',
  forcBuildFlags: ['--release'],
  autoStartFuelCore: false,
  output: './src/artifacts',
});
