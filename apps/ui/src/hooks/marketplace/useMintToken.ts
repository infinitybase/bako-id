import { useCustomToast } from '@/components';
import collectionContractAbi from '@/modules/marketplace/utils/collection-contract-abi.json';
import { MINT_TOKEN_LOG_ID } from '@/modules/marketplace/utils/constants';
import { NFTCollection } from '@/modules/marketplace/utils/mint';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { fetchMetadata } from '@/utils/formatter';
import { useWallet } from '@fuels/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type BN, Interface } from 'fuels';

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
        id: string;
    }[];
};

type FuelReceipt = {
    rb: BN;
    data: string;
};

const getMintedAssetMetadata = async (uri: string) => {
    const metadata = await fetchMetadata(uri);
    return metadata;
};

const getMintedAssets = async (logs: TransactionResultLog[]) => {
    const uriLogs = logs.filter((log) => log.key === 'uri');

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
            const contractInterface = new Interface(collectionContractAbi);

            const logs = transactionResult.receipts
                .filter(
                    (receipt) =>
                        (receipt as FuelReceipt)?.rb?.toString() === MINT_TOKEN_LOG_ID
                )
                .map(
                    (receipt) =>
                        contractInterface.decodeLog(
                            (receipt as FuelReceipt)?.data,
                            (receipt as FuelReceipt)?.rb?.toString()
                        )[0]
                ) as TransactionResultLog[];

            const mintedAssets = await getMintedAssets(logs);

            return {
                transactionId: transactionResult.id,
                mintedAssets: mintedAssets,
            };
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
            const isConnectionClosed = err.message.includes('Client disconnected');
            const description = err.message.includes('insufficient coins available')
                ? 'Insufficient balance to cover the transaction'
                : 'An error occurred while minting the tokens';
            errorToast({
                title: 'Transaction error',
                description: isConnectionClosed
                    ? 'User declined the transaction'
                    : description,
            });
        },
    });

    return {
        mintToken,
        isPending,
    };
};
