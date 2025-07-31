import { NFTCollection } from '@/modules/marketplace/utils/mint';
import type { Provider } from 'fuels';
import { useMemo } from 'react';

export const useMintContract = (collectionId: string, provider: Provider, isMintable: boolean) => {
    const contract = useMemo(() => {
        if (!collectionId || !provider || !isMintable) return null;
        return new NFTCollection(collectionId, provider!);
    }, [collectionId, provider, isMintable]);

    return contract;
};
