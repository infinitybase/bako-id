import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { useChainId } from '../useChainId';

export const useGetAsset = (assetId: string) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [MarketplaceQueryKeys.ASSET, assetId, chainId],
    queryFn: () =>
      marketplaceService.getAssetById({ id: assetId, chainId: chainId! }),
    enabled: !isNil(chainId),
  });
};
