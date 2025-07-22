import { marketplaceService } from '@/services/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useQuery } from '@tanstack/react-query';
import { useChainId } from '../useChainId';

type useGetCollectionProps = {
  collectionId: string;
};

export const useGetCollection = ({ collectionId }: useGetCollectionProps) => {
  const { chainId } = useChainId();

  const { data: collection, ...rest } = useQuery({
    queryKey: [MarketplaceQueryKeys.COLLECTION, chainId, collectionId],
    queryFn: async () => {
      const { data } = await marketplaceService.getCollection({
        collectionId,
        chainId: chainId === 0 ? Networks.TESTNET : Networks.MAINNET,
      });

      return {
        data,
      };
    },
    enabled: typeof chainId === 'number' && !!collectionId,
  });

  return { collection, ...rest };
};
