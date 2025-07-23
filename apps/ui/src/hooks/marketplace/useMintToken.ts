import { useCustomToast } from '@/components';
import { NFTCollection } from '@/modules/marketplace/utils/mint';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';
import { useWallet } from '@fuels/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bn, getAssetById } from 'fuels';

export const useMintToken = (collectionId: string) => {
    const { successToast } = useCustomToast();

    const queryClient = useQueryClient();
    const { wallet } = useWallet();
    const mintContract = new NFTCollection(collectionId, wallet!);

    const { data, ...rest } = useQuery({
        queryKey: [MarketplaceQueryKeys.MINT_TOKEN, collectionId],
        queryFn: async () => {
            const chainId = await wallet?.provider.getChainId();

            const network = resolveNetwork(chainId ?? Networks.MAINNET);

            const supplies = await mintContract.getMaxSupply();
            const minted = await mintContract.getTotalAssets();
            const config = await mintContract.collectionConfig();
            const mintPrice = await mintContract.mintPrice();
            const asset = await getAssetById({
                network: network?.toLowerCase() as 'mainnet' | 'testnet',
                assetId: mintPrice.asset,
            });

            return {
                supplies,
                minted,
                config,
                amount: mintPrice.amount,
                asset,
            };
        },
        enabled: !!wallet,
    });

    const { mutateAsync: mintToken, isPending } = useMutation({
        mutationFn: async (quantity: number) => {
            await mintContract.mint(quantity);

            return quantity
        },
        onSuccess: (quantity) => {
            successToast({
                title: `You have successfully minted ${quantity} tokens`,
                description:
                    'You can now view your tokens in your wallet',
            });
            queryClient.invalidateQueries({
                queryKey: [MarketplaceQueryKeys.MINT_TOKEN, collectionId],
            });
        },
    });

    return {
        query: {
            supplies: bn(data?.supplies).toString(),
            totalMinted: bn(data?.minted).toString(),
            config: data?.config,
            mintPrice: data?.amount,
            asset: data?.asset,
            ...rest,
        },
        mutation: {
            mintToken,
            isPending,
        },
    };
};
