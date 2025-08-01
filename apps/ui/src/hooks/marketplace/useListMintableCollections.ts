import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import type { Collection } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useChainId } from '../useChainId';

type useListMintableCollectionsProps = {
    page?: number;
    limit?: number;
};

export const useListMintableCollections = ({
    limit,
}: useListMintableCollectionsProps) => {
    const { chainId } = useChainId();
    const {
        data: collections,
        isLoading: isLoadingCollections,
        ...rest
    } = useQuery<Collection[]>({
        queryKey: [
            MarketplaceQueryKeys.ALL_MINTABLE_COLLECTIONS,
            limit,
            chainId,
        ],
        queryFn: async () => {
            const { data } = await marketplaceService.listMintableCollections({
                chainId: chainId ?? Networks.TESTNET,
                limit: limit ?? 3,
            });

            return data;
        },
        placeholderData: (data) => data,
    });
    return {
        collections,
        isLoading: isLoadingCollections,
        ...rest,
    };
};
