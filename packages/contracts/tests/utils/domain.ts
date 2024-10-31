/**
 * Converts a domain string into a Uint8Array of bytes.
 *
 * @param {string} domain - The domain string to convert.
 * @returns {Uint8Array} - The converted bytes.
 */
export const domainToBytes = (domain: string): Uint8Array =>
  Uint8Array.from(domain.split('').map((char) => char.charCodeAt(0)));
