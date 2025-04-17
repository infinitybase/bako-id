import { MetadataKeys } from '@bako-id/sdk';

import { ENSMetadataKeys, ensToMetadataMap } from './types';
import { ethers } from 'ethers';

const ethersProvider = new ethers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/a44094c3208b48f5bbdd76c7c83212fc'
);

export async function getEnsMetadata(name: string) {
  const resolver = await ethersProvider.getResolver(name);

  try {
    if (!resolver) {
      return null;
    }

    const metadata: Record<string, string> = {};

    for (const key of Object.keys(ENSMetadataKeys)) {
      const enumKey = key as keyof typeof ENSMetadataKeys;
      const recordKey = ENSMetadataKeys[enumKey];
      const metadataKey = ensToMetadataMap[recordKey];

      try {
        const value = await resolver.getText(recordKey);
        if (value) {
          metadata[metadataKey] = value;
        }
      } catch (error) {
        console.error(`Error fetching ${recordKey} for ${name}:`, error);
      }
    }

    metadata[MetadataKeys.ENS_DOMAIN] = name;

    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for ${name}:`, error);
    return null;
  }
}
