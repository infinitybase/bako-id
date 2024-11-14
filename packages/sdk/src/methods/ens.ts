import { createEnsPublicClient } from '@ensdomains/ensjs';
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { type ENSMetadataKeys, ensToMetadataMap } from './types';

// const ENS_API_KEY = 'da6fef9ce5f2371f562dda77c4029e14';

const { ENS_API_KEY } = process.env;

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http('https://web3.ens.domains/v1/mainnet'),
  key: ENS_API_KEY,
});

const graphql_url = `https://gateway.thegraph.com/api/${ENS_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`;

export const ensCheckRegister = async (name: string) => {
  const records = await fetchEnsData(name);
  if (!records) return null;

  const keys = records.resolver.texts;

  const request = await client.getRecords({
    name,
    texts: [...keys],
  });

  const mappedResult: Record<string, string> = {};

  for (const { key, value } of request.texts) {
    const ensKey = key as ENSMetadataKeys;
    const metadataKey = ensToMetadataMap[ensKey];

    if (metadataKey) {
      mappedResult[metadataKey] = value;
    }
  }

  return mappedResult;
};

async function fetchEnsData(name: string) {
  const ensQuery = `query {
    domains(
      where: {
          name: "${name}"
      }
    ) {
      name
      expiryDate
      registration {
        expiryDate
        registrationDate
      }
      resolver {
        texts
        contentHash
        id
        
      }
    }
  }`;
  const response = await fetch(graphql_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: ensQuery }),
  });

  const { data } = await response.json();
  const d = data?.domains[0] ?? undefined;

  return d;
}
