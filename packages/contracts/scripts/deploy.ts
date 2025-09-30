import {
  type Account,
  type ContractFactory,
  type Provider,
  Src14OwnedProxy,
  Src14OwnedProxyFactory,
  ZeroBytes32,
} from 'fuels';
import {
  type Contracts,
  ManagerFactory,
  NftFactory,
  RegistryFactory,
  ResolverFactory,
  getContractId,
} from '../src';
import { logger, setContractId, setup } from './utils';

type DeployConfig = {
  contract: {
    name: Contracts;
    factory: ContractFactory;
    configurableConstants?: Record<any, any>;
  };
  provider: Provider;
  wallet: Account;
};

const deployContractWithProxy = async (config: DeployConfig) => {
  const { provider, wallet, contract } = config;

  logger.info(`[${contract.name}] Deploying new instance...`);
  const { contractId, waitForResult: waitForDeploy } =
    await contract.factory.deploy({
      configurableConstants: contract.configurableConstants,
    });
  await waitForDeploy();

  logger.info(`[${contract.name}] Checking has proxy instance...`);
  const proxyAddress = getContractId(provider.url, contract.name);
  const addressType = await provider.getAddressType(
    proxyAddress ?? ZeroBytes32
  );
  const isDeployed = addressType === 'Contract';

  if (!isDeployed) {
    logger.info(`[${contract.name}] Deploying proxy...`);
    const proxyDeployment = await Src14OwnedProxyFactory.deploy(wallet, {
      configurableConstants: {
        INITIAL_TARGET: { bits: contractId },
        INITIAL_OWNER: {
          Initialized: { Address: { bits: wallet.address.toB256() } },
        },
      },
    });

    const { contract: proxy } = await proxyDeployment.waitForResult();
    const { waitForResult } = await proxy.functions.initialize_proxy().call();
    await waitForResult();

    logger.success(
      `Proxy for ${contract.name} deployed! Id: ${proxy.id.toB256()}`
    );
    const proxyAddress = proxy.id.toB256();
    setContractId(provider.url, contract.name, proxyAddress);
    return proxy.id.toString();
  }

  logger.info(`[${contract.name}] Has proxy instance! Setting target...`);
  const proxy = new Src14OwnedProxy(proxyAddress, wallet);
  const { waitForResult } = await proxy.functions
    .set_proxy_target({ bits: contractId })
    .call();
  await waitForResult();
  logger.success(
    `[${contract.name}] Target set! Proxy: ${proxy.id.toB256()} Target: ${contractId}`
  );
  return proxy.id.toString();
};

const deployContract = async (config: DeployConfig) => {
  const { provider, contract } = config;

  logger.info(`Deploying ${contract.name}...`);
  const { contractId, waitForResult: waitForDeploy } =
    await contract.factory.deploy({
      configurableConstants: contract.configurableConstants,
    });
  await waitForDeploy();

  logger.success(`${contract.name} deployed! Id: ${contractId}`);
  setContractId(provider.url, contract.name, contractId);
};

const main = async () => {
  const { wallet, provider } = await setup();

  await deployContractWithProxy({
    wallet,
    provider,
    contract: {
      name: 'registry',
      factory: new RegistryFactory(wallet),
    },
  });

  await deployContractWithProxy({
    wallet,
    provider,
    contract: {
      name: 'manager',
      factory: new ManagerFactory(wallet),
    },
  });

  await deployContract({
    wallet,
    provider,
    contract: {
      name: 'resolver',
      factory: new ResolverFactory(wallet),
    },
  });

  await deployContract({
    wallet,
    provider,
    contract: {
      name: 'nft',
      factory: new NftFactory(wallet),
    },
  });
};

main()
  .then(() => {
    logger.success('Done!');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Construct failed!', error);
    process.exit(1);
  });
