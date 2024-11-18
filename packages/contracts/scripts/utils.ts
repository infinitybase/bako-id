import { Provider, Wallet } from 'fuels';
import dotenv from 'dotenv';

dotenv.config({
  path: '../.env',
});

export const logger = {
  success: (...data: any) => console.log(`✅ `, ...data),
  info: (...data: any) => console.log(`🗞 `, ...data),
  error: (...data: any) => console.error(`❌ `, ...data),
  warn: (...data: any) => console.log(`❌ `, ...data),
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

  const provider = await Provider.create(providerUrl);
  const wallet = Wallet.fromPrivateKey(privateKey, provider);
  const balance = await wallet.getBalance();

  logger.info(
    `Setup
    Provider: ${providerUrl} 
    Wallet: ${wallet.address.toB256()}
    Balance: ${balance.format()} ETH`,
  );

  return { provider, wallet };
};
