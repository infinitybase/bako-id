import * as fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { createConfig } from 'fuels';
import { resolveNetwork } from './src';

dotenv.config();

export default createConfig({
  workspace: './sway',
  forcBuildFlags: ['--release'],
  autoStartFuelCore: false,
  output: './src/artifacts',
  privateKey: process.env.PRIVATE_KEY,
  providerUrl: process.env.PROVIDER_URL,
  onDeploy: async (config, data) => {
    const { providerUrl, output } = config;
    const networkName = resolveNetwork(providerUrl);

    const contractIdJsonPath = path.join(output, 'contracts-fuel.json');

    if (!fs.existsSync(contractIdJsonPath)) {
      fs.writeFileSync(contractIdJsonPath, '{}');
    }

    const contractsIdsFile = JSON.parse(
      fs.readFileSync(contractIdJsonPath, 'utf-8')
    );
    const contractsIds = Object.fromEntries(
      data.map(({ name, contractId }) => [name, contractId])
    );

    const networkContractsIds = {
      ...contractsIdsFile,
      [networkName]: contractsIds,
    };
    fs.writeFileSync(
      contractIdJsonPath,
      JSON.stringify(networkContractsIds, null, 2)
    );
  },
});
