import { MarketplaceQueryKeys } from '@/utils/constants';
import { Networks, resolveNetwork } from '@/utils/resolverNetwork';
import { useWallet } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { bn, getAssetById, Provider } from 'fuels';
import { useMintContract } from '../sdk/mint';

const { VITE_PROVIDER_URL } = import.meta.env;

export const useGetMintData = (collectionId: string, isMintable: boolean) => {
    const { wallet } = useWallet();

    const provider = wallet?.provider ?? new Provider(VITE_PROVIDER_URL);
    const mintContract = useMintContract(collectionId, provider, isMintable);

    const { data, ...rest } = useQuery({
        queryKey: [MarketplaceQueryKeys.MINT_TOKEN, collectionId],
        queryFn: async () => {
            const chainId = await provider.getChainId();
            const network = resolveNetwork(chainId ?? Networks.MAINNET);

            const { maxSupply, totalAssets, mintPrice } =
                await mintContract!.getResumeMint();

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
        enabled: !!collectionId && isMintable && !!mintContract,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        maxSupply: bn(data?.maxSupply).toString(),
        totalMinted: bn(data?.minted).toString(),
        mintPrice: data?.amount,
        asset: data?.asset,
        ...rest,
    };
};
