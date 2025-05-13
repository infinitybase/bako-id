import { resolveNetwork } from '@/utils/resolverNetwork';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export type BakoIdNamesResponse = {
  name: string;
  resolver: string;
};

export default class BakoIdService {
  static async names(
    addresses: string[],
    chainId: number
  ): Promise<{ names: BakoIdNamesResponse[] }> {
    try {
      const network = resolveNetwork(chainId);
      const addrs = addresses.map((addr) => `address=${addr}`).join('&');
      const url = `${BASE_API_URL}/${network}/name?${addrs}`;

      const response = await fetch(url);

      const data = await response.json();

      return data;
    } catch {
      return { names: [] };
    }
  }

  static async name(address: string, chainId: number): Promise<string | null> {
    try {
      const network = resolveNetwork(chainId);
      const url = `${BASE_API_URL}/${network}/name/${address}`;

      const response = await fetch(url);

      const data = await response.json();

      return data.name;
    } catch {
      return null;
    }
  }
}
