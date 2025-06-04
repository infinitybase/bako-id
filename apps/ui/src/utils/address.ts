import { isB256 } from 'fuels';

export const CHECKSUM_MESSAGE =
  "We couldn't verify the address. Please ensure that the resolver is set to a valid address.";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class AddressUtils {
  static isValid(address: string) {
    try {
      return isB256(address);
    } catch (_e) {
      return false;
    }
  }

  static format(address: string, factor?: number) {
    const size = factor ?? 10;

    if (!address) return;
    return `${address.slice(0, size)}...${address.slice(-4)}`;
  }

  static isEqual(address1: string | undefined, address2: string | undefined) {
    if (!address1 || !address2) return false;
    return address1.toLowerCase() === address2.toLowerCase();
  }
}

export { AddressUtils };
