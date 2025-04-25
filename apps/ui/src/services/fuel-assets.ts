export interface Metadata {
  [key: string]: string;
}

export interface AssetNetwork {
  type: string;
  chain: string;
  decimals: number;
  chainId: number;
  __typename: string;
  assetId?: string;
}

export interface FuelAsset {
  amount: string;
  assetId: string;
  owner: string;
  name: string | null;
  symbol: string | null;
  decimals: number;
  suspicious: boolean;
  verified: boolean;
  icon?: string;
  networks?: AssetNetwork[];
  isNFT?: boolean;
  metadata?: Metadata;
  uri?: string;
  contractId?: string;
  subId?: string;
  collection?: string;
  rate: number;
}

export interface ByAddress {
  address: string;
  chainId: number;
}

export type ByAddressResponse = {
  data: FuelAsset[];
  pageInfo: { count: number };
};

const networks: Record<number, string> = {
  9889: 'https://mainnet-explorer.fuel.network',
  0: 'https://explorer-indexer-testnet.fuel.network',
};

export class FuelAssetService {
  static async byAddress({
    address,
    chainId,
  }: ByAddress): Promise<ByAddressResponse> {
    const networkUrl = FuelAssetService.networkUrl(chainId);
    const response = await fetch(`${networkUrl}/accounts/${address}/assets`);
    return response.json();
  }

  static async byAssetId({
    assetId,
    chainId,
  }: { assetId: string; chainId: number }): Promise<FuelAsset | null> {
    try {
      const networkUrl = FuelAssetService.networkUrl(chainId);
      const response = await fetch(`${networkUrl}/assets/${assetId}`);
      return response.json();
    } catch {
      return null;
    }
  }

  private static networkUrl(chainId: number): string {
    let network = networks[chainId];
    if (!network) {
      network = networks[9889];
    }
    return network;
  }
}
