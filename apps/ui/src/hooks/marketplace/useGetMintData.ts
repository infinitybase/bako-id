import { NFTCollection } from '@/modules/marketplace/utils/mint';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';
import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { bn, getAssetById } from 'fuels';

export const useGetMintData = (collectionId: string) => {
    const { wallet } = useWallet();
    const mintContract = new NFTCollection(collectionId, wallet!);

    const { data, ...rest } = useQuery({
        queryKey: [MarketplaceQueryKeys.MINT_TOKEN, collectionId],
        queryFn: async () => {
            const chainId = await wallet?.provider.getChainId();

            const network = resolveNetwork(chainId ?? Networks.MAINNET);

            const { maxSupply, totalAssets, mintPrice, config } =
                await mintContract.getResumeMint();

            const asset = await getAssetById({
                network: network?.toLowerCase() as 'mainnet' | 'testnet',
                assetId: mintPrice.asset,
            });

            return {
                supplies: maxSupply,
                minted: totalAssets,
                config,
                amount: mintPrice.amount,
                asset,
            };
        },
        enabled: !!wallet,
    });

    return {
        supplies: bn(data?.supplies).toString(),
        totalMinted: bn(data?.minted).toString(),
        config: data?.config,
        mintPrice: data?.amount,
        asset: data?.asset,
        ...rest,
    };
};
