import { useCustomToast } from "@/components";
import { NFTCollection } from "@/modules/marketplace/utils/mint";
import { MarketplaceQueryKeys } from "@/utils/constants";
import { useWallet } from "@fuels/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMintToken = (collectionId: string) => {
    const { successToast, errorToast } = useCustomToast();

    const queryClient = useQueryClient();
    const { wallet } = useWallet();
    const { mutateAsync: mintToken, isPending } = useMutation({
        mutationFn: async (quantity: number) => {
            const mintContract = new NFTCollection(collectionId, wallet!);
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
        onError: () => {
            errorToast({
                title: 'Transaction error',
                description: 'An error occurred while minting the tokens',
            });
        },
    });


    return {
        mintToken,
        isPending,
    }
}