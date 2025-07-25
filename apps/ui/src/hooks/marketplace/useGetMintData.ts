import { NFTCollection } from '@/modules/marketplace/utils/mint';
import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';
import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { bn, getAssetById, Provider } from 'fuels';

const { VITE_PROVIDER_URL } = import.meta.env;

export const useGetMintData = (collectionId: string, isMintable: boolean) => {
    const { wallet } = useWallet();

    const { data, ...rest } = useQuery({
        queryKey: [MarketplaceQueryKeys.MINT_TOKEN, collectionId, wallet?.provider],
        queryFn: async () => {
            const provider = wallet?.provider ?? new Provider(VITE_PROVIDER_URL)
            const mintContract = new NFTCollection(collectionId, provider!);
            const chainId = await provider.getChainId();

            const network = resolveNetwork(chainId ?? Networks.MAINNET);

            const { maxSupply, totalAssets, mintPrice } =
                await mintContract.getResumeMint();

            const asset = await getAssetById({
                network: network?.toLowerCase() as 'mainnet' | 'testnet',
                assetId: mintPrice.asset,
            });

            return {
                maxSupply,
                minted: totalAssets,
                amount: mintPrice.amount,
                asset,
            };
        },
        enabled: !!collectionId && isMintable,
    });

    return {
        maxSupply: bn(data?.maxSupply).toString(),
        totalMinted: bn(data?.minted).toString(),
        mintPrice: data?.amount,
        asset: data?.asset,
        ...rest,
    };
};
