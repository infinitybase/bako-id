import { useCustomToast } from '@/components';
import collectionContractAbi from '@/modules/marketplace/utils/collection-contract-abi.json';
import { MINT_TOKEN_LOG_ID } from '@/modules/marketplace/utils/constants';
import { NFTCollection } from '@/modules/marketplace/utils/mint';
import {
    type FuelReceipt,
    getMintedAssets,
    type MintedAssetsTransaction,
    type TransactionResultLog,
} from '@/modules/marketplace/utils/minted-nfts-data';
import { ETH_ID, MarketplaceQueryKeys } from '@/utils/constants';
import { useBalance, useAccount, useWallet } from '@fuels/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Interface } from 'fuels';

const TRANSACTION_FEE_ERROR = 'Insufficient balance to cover the transaction fee';

export const useMintToken = (
    collectionId: string,
    onSuccess?: (mintedAssetsTransaction: MintedAssetsTransaction) => void
) => {
    const { successToast, errorToast } = useCustomToast();
    const { account } = useAccount();
    const { balance: ethBalance } = useBalance({
        address: account,
        assetId: ETH_ID,
    });

    const queryClient = useQueryClient();
    const { wallet } = useWallet();
    const { mutateAsync: mintToken, isPending } = useMutation({
        mutationFn: async (quantity: number) => {
            const mintContract = new NFTCollection(collectionId, wallet!);

            const { fee } = await mintContract.simulateMint(quantity);

            if (ethBalance?.lt(fee)) {
                errorToast({
                    title: 'Not enough ETH',
                    description: 'Insufficient balance to cover the transaction fee'
                });

                throw new Error(TRANSACTION_FEE_ERROR);
            }

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

            if (!err.message.includes(TRANSACTION_FEE_ERROR)) {
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
            }
        },
    });

    return {
        mintToken,
        isPending,
    };
};
