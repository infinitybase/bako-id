import { useCustomToast } from '@/components';
import { NFTCollection } from '@/modules/marketplace/utils/mint';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { fetchMetadata } from '@/utils/formatter';
import { useWallet } from '@fuels/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';



const getMintedAssetMetadata = async (uri: string) => {
    const metadata = await fetchMetadata(uri);
    return metadata;
};

type TransactionResultLog = {
    asset: {
        bits: string;
    };
    key: string;
    metadata: Record<string, string>;
};

export type MintedAssetsTransaction = {
    transactionId: string;
    mintedAssets: {
        name: string;
        image: string;
        id: string
    }[]
};

export const useMintToken = (
    collectionId: string,
    onSuccess?: (mintedAssetsTransaction: MintedAssetsTransaction) => void
) => {
    const { successToast, errorToast } = useCustomToast();

    const queryClient = useQueryClient();
    const { wallet } = useWallet();
    const { mutateAsync: mintToken, isPending } = useMutation({
        mutationFn: async (quantity: number) => {
            const mintContract = new NFTCollection(collectionId, wallet!);
            const { transactionResult } = await mintContract.mint(quantity);


            const getMintedAssets = async () => {
                if (!transactionResult.logs) return undefined;

                const uriLogs = (transactionResult.logs as TransactionResultLog[]).filter(
                    (log) => log.key === 'uri'
                );

                if (uriLogs.length === 0) return undefined;

                const uniqueAssetsMap = new Map<string, TransactionResultLog>();

                for (const log of uriLogs) {
                    const assetId = log.asset.bits;
                    if (!uniqueAssetsMap.has(assetId)) {
                        uniqueAssetsMap.set(assetId, log);
                    }
                }

                const mintedAssets = await Promise.all(
                    Array.from(uniqueAssetsMap.values()).map(async (log) => {
                        const metadata = await getMintedAssetMetadata(log.metadata.String);
                        return {
                            image: metadata.image,
                            name: metadata.name,
                            id: log.asset.bits,
                        };
                    })
                );

                return mintedAssets;
            };

            const mintedAssets = await getMintedAssets();

            return { transactionId: transactionResult.id, mintedAssets };
        },
        onSuccess: ({ transactionId, mintedAssets }) => {

            successToast({
                title: `You have successfully minted ${mintedAssets?.length} tokens`,
                description: 'You can now view your tokens in your wallet',
            });
            queryClient.invalidateQueries({
                queryKey: [MarketplaceQueryKeys.MINT_TOKEN, collectionId],
            });
            onSuccess?.({ transactionId, mintedAssets: mintedAssets || [] });
        },
        onError: (err) => {
            const description = err.message.includes('insufficient coins available')
                ? 'Insufficient balance to cover the transaction'
                : 'An error occurred while minting the tokens';
            errorToast({
                title: 'Transaction error',
                description,
            });
        },
    });

    return {
        mintToken,
        isPending,
    };
};
