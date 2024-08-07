import { TAI64 } from 'tai64';
import { config } from '../config';
import { getRegistryContract } from '../setup';
import { getProviderFromParams, type ProviderParams } from '../utils';

type Handle = {
  name: string;
  isPrimary: boolean;
};

/**
 * Retrieves all handles by owner address. Returns the handle name and a boolean indicating if it is the primary domain.
 * @param {string} owner - The owner of the records.
 * @param {ProviderParams} [params] - Additional provider parameters.
 * @returns {Promise<Handle[]>} - A promise that resolves to an array of domain records.
 */
export async function getAll(owner: string, params?: ProviderParams) {
  const provider = await getProviderFromParams(params);
  const { registry } = await getRegistryContract({
    provider,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  const { value } = await registry.functions.get_all(owner).get();

  return convertBytesToDomain(Array.from(value));
}

function convertBytesToDomain(bytes: number[]) {
  const result: Handle[] = [];

  const [, nameSize] = bytes.splice(0, 2);
  const name = String.fromCharCode(...bytes.splice(0, nameSize));

  if (!name) {
    return [];
  }

  const [, boolSize] = bytes.splice(0, 2);
  const [isPrimary] = bytes.splice(0, boolSize);
  result.push({ name, isPrimary: !!isPrimary });

  if (bytes.length) {
    result.push(...convertBytesToDomain(bytes));
  }

  return result;
}

/**
 * Retrieves the grace period for
 * @param {string} owner - The owner of the domain.
 * @param {ProviderParams} [params] - Additional provider parameters.
 * @returns {GracePeriodOutput} - A object with timestamp, period and grace period.
 */

export async function getGracePeriod(owner: string, params?: ProviderParams) {
  const provider = await getProviderFromParams(params);
  const { registry } = await getRegistryContract({
    provider,
    storageId: config.STORAGE_CONTRACT_ID!,
  });

  const { value } = await registry.functions.get_grace_period(owner).get();

  return {
    timestamp: new Date(
      TAI64.fromString(value.timestamp.toString(), 10).toUnix() * 1000,
    ),
    period: new Date(
      TAI64.fromString(value.period.toString(), 10).toUnix() * 1000,
    ),
    gracePeriod: new Date(
      TAI64.fromString(value.grace_period.toString(), 10).toUnix() * 1000,
    ),
  };
}
