import { MarketplaceQueryKeys } from '@/utils/constants';
import { useChainId } from '../useChainId';
import { useQuery } from '@tanstack/react-query';
import { Networks } from '@/utils/resolverNetwork';
import { marketplaceService } from '@/services/marketplace';

type useGetCollectionProps = {
  collectionId: string;
};

export const useGetCollection = ({ collectionId }: useGetCollectionProps) => {
  const { chainId, isLoading } = useChainId();

  const { data: collection, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.COLLECTION, chainId, collectionId],
    queryFn: async () => {
      const { data } = await marketplaceService.getCollection({
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
