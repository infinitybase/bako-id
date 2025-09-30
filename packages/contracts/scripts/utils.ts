import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { Provider, Wallet } from 'fuels';
import { type Contracts, type NetworkKeys, resolveNetwork } from '../src';
import contracts from '../src/artifacts/contracts-fuel.json';

dotenv.config({
  path: '../.env',
});

export const logger = {
  success: (...data: any) => console.log(`✅ `, ...data),
  info: (...data: any) => console.log(`🗞 `, ...data),
  error: (...data: any) => console.error(`❌ `, ...data),
  warn: (...data: any) => console.log(`❌ `, ...data),
};

export const setContractId = <N extends NetworkKeys>(
  provider: string,
  contract: Contracts,
  contractId: string
) => {
  const network = resolveNetwork(provider) as N;
  if (!contracts[network]) {
    contracts[network] = {
      manager: '',
      registry: '',
      resolver: '',
      nft: '',
    };
  }

  contracts[network]![contract] = contractId;
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', './artifacts/contracts-fuel.json'),
    JSON.stringify(contracts, null, 2)
  );
};

export const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

export const setup = async () => {
  const providerUrl = requireEnv('PROVIDER_URL');
  const privateKey = requireEnv('PRIVATE_KEY');

  const provider = new Provider(providerUrl);
  const wallet = Wallet.fromPrivateKey(privateKey, provider);
  const balance = await wallet.getBalance();

  logger.info(
    `Setup
    Provider: ${providerUrl} 
    Wallet: ${wallet.address.toB256()}
    Balance: ${balance.format()} ETH`
  );

  return { provider, wallet };
};
