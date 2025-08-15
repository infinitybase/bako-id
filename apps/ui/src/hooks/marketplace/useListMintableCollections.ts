import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import type { Collection } from '@/types/marketplace';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { useChainId } from '../useChainId';
import { useWallet } from '@fuels/react';

type useListMintableCollectionsProps = {
    page?: number;
    limit?: number;
};

export const useListMintableCollections = ({
    limit,
}: useListMintableCollectionsProps) => {
    const { chainId } = useChainId();
    const { wallet } = useWallet();
    const defaultChainId = !wallet && chainId === 0 ? Networks.MAINNET : chainId;
    const {
        data: collections,
        isLoading: isLoadingCollections,
        ...rest
    } = useQuery<Collection[]>({
        queryKey: [
            MarketplaceQueryKeys.ALL_MINTABLE_COLLECTIONS,
            limit,
            defaultChainId,
        ],
        queryFn: async () => {
            const { data } = await marketplaceService.listMintableCollections({
                chainId: defaultChainId ?? Networks.MAINNET,
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
