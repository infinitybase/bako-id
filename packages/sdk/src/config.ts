import contractsId from './types/sway/contract-ids.json';

const config = {
  STORAGE_CONTRACT_ID: process.env.STORAGE_ID,
  REGISTRY_CONTRACT_ID: contractsId.registryContract,
  METADATA_CONTRACT_ID: contractsId.metadataContract,
  PROVIDER_DEPLOYED: process.env.PROVIDER_URL,
};

export { config };
