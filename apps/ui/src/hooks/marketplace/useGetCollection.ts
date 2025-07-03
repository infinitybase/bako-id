import { MarketplaceQueryKeys } from '@/utils/constants';
import { useChainId } from '../useChainId';
import { newMarketplaceService } from '@/services/new-marketplace';
import { useQuery } from '@tanstack/react-query';
import { Networks } from '@/utils/resolverNetwork';

type useGetCollectionProps = {
  collectionId: string;
};

export const useGetCollection = ({ collectionId }: useGetCollectionProps) => {
  const { chainId, isLoading } = useChainId();

  const { data: collection, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.COLLECTION, chainId, collectionId],
    queryFn: async () => {
      const { data } = await newMarketplaceService.getCollection({
        collectionId,
        chainId: chainId ?? Networks.MAINNET,
      });

      return {
        data,
      };
    },
    enabled: !isLoading,
  });

  return { collection, ...rest };
};
