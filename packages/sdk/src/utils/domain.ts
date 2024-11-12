import { type BN, bn } from 'fuels';
import { InvalidDomainError } from './errors';

/**
 * Check if a given domain is valid.
 *
 * @param {string} domain - The domain to be checked.
 * @returns {boolean} - True if the domain is valid, false otherwise.
 */
export const isValidDomain = (domain: string): boolean =>
  /^@?[a-z0-9_-]+$/.test(domain);

/**
 * Checks if a given domain is valid and throw error.
 *
 * @param {string} domain - The domain to be validated.
 * @throws {InvalidDomainError} If the domain is not valid.
 * @returns {string} - The domain name without handler
 */
export const assertValidDomain = (domain: string) => {
  if (!isValidDomain(domain)) throw new InvalidDomainError();

  return domain.replace('@', '');
};

/**
 * Calculate the price for a domain name based on its length and period.
 *
 * @param {string} domain - The domain name.
 * @param {number} [period=1] - The period in which the domain name will be registered.
 * @returns {BN} - The calculated price for the domain name.
 */
export const domainPrices = (domain: string, period = 1) => {
  const domainSize = domain.length;

  if (domainSize < 3) {
    return bn(0);
  }

  const prices: Record<number | string, BN> = {
    [3]: bn.parseUnits('0.005'),
    [4]: bn.parseUnits('0.001'),
    default: bn.parseUnits('0.0002'),
  };

  const price: BN = prices[domainSize] || prices.default;

  return price.mul(period);
};

/**
 * Converts a domain string into a Uint8Array of bytes.
 *
 * @param {string} domain - The domain string to convert.
 * @returns {Uint8Array} - The converted bytes.
 */
export const domainToBytes = (domain: string): Uint8Array =>
  Uint8Array.from(domain.split('').map((char) => char.charCodeAt(0)));
