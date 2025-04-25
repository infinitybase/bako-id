import { FuelAssetService } from '@/services/fuel-assets';
import { marketplaceClient } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

export const useListAssets = () => {
  const { chainId } = useChainId();
  const { data: assets, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ASSETS, chainId],
    queryFn: async () => {
      const assets = await marketplaceClient.getAssets();

      const assetsWithMetadata = await Promise.all(
        assets.map(async (asset) => {
          const metadata = await FuelAssetService.byAssetId({
            assetId: asset.id,
            chainId: chainId!,
          });
          return {
            ...asset,
            metadata,
          };
        })
      );
      return assetsWithMetadata;
    },
    initialData: [],
    enabled: chainId !== null,
  });

  return { assets, ...rest };
};
