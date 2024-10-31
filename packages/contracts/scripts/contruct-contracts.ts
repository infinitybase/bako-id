import { Provider, Wallet } from 'fuels';
import dotenv from 'dotenv';
import { getContractId, Manager, Registry, Resolver } from '../src';

dotenv.config({
  path: '../.env',
});

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

const setup = async () => {
  const providerUrl = requireEnv('PROVIDER_URL');
  const privateKey = requireEnv('PRIVATE_KEY');

  const provider = await Provider.create(providerUrl);
  const wallet = Wallet.fromPrivateKey(privateKey, provider);

  return { provider, wallet };
};

const main = async () => {
  const { provider, wallet } = await setup();

  const managerId = getContractId(provider.url, 'manager');
  const resolverId = getContractId(provider.url, 'resolver');
  const registryId = getContractId(provider.url, 'registry');

  const manager = new Manager(managerId, wallet);
  const resolver = new Resolver(resolverId, wallet);
  const registry = new Registry(registryId, wallet);

  try {
    const managerConstruct = await manager.functions
      .constructor({ ContractId: { bits: registryId } })
      .call();
    await managerConstruct.waitForResult();
    console.log('Manager construct success!');
  } catch (e) {
    if (e instanceof Error && /ContractAlreadyInitialized/.test(e.message)) {
      console.error('Manager Contract is already initialized.');
    } else {
      console.error('Manager construct failed', e);
    }
  }

  try {
    const resolverConstruct = await resolver.functions
      .constructor({ bits: managerId })
      .call();
    await resolverConstruct.waitForResult();
    console.log('Resolver construct success!');
  } catch (e) {
    if (e instanceof Error && /Contract already initialized/.test(e.message)) {
      console.error('Resolver Contract is already initialized.');
    } else {
      console.error('Resolver construct failed', e);
    }
  }

  try {
    const registryConstruct = await registry.functions
      .constructor({ bits: managerId })
      .call();
    await registryConstruct.waitForResult();
    console.log('Registry construct success!');
  } catch (e) {
    if (e instanceof Error && /AlreadyInitialized/.test(e.message)) {
      console.error('Registry Contract is already initialized.');
    } else {
      console.error('Registry construct failed', e);
    }
  }
};

main()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Construct failed!', error);
    process.exit(1);
  });
