import contractsId from './types/contract-ids.json';

const config = {
  STORAGE_CONTRACT_ID: process.env.STORAGE_ID ,
  REGISTRY_CONTRACT_ID: contractsId.registryContract,
  PROVIDER_DEPLOYED: process.env.PROVIDER_URL,
};

export { config };
