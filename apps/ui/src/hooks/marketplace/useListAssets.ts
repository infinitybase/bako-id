import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { getAssetMetadata } from '@/utils/getOrderMetadata';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

export const useListAssets = () => {
  const { chainId } = useChainId();

  const { data: assets, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.ASSETS, chainId],
    queryFn: async () => {
      const assets = await marketplaceService.getAssets();

      const assetsWithMetadata = await Promise.all(
        assets.map(async (asset) => {
          const metadata = await getAssetMetadata(asset.id, chainId);
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
