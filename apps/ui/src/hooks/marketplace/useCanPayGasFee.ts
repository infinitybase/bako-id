import { useMemo } from 'react';
import { useBalance } from '@fuels/react';
import { bn } from 'fuels';
import { ETH_ID } from '@/utils/constants';
import { useGetTransactionCost } from './useGetTransactionCost';
import { MarketplaceAction } from '@bako-id/marketplace';

interface UseCanPayGasFeeParams {
    orderId: string;
    account: string | undefined;
    shouldEstimateFee: boolean;
}

export const useCanPayGasFee = ({
    orderId,
    account,
    shouldEstimateFee,
}: UseCanPayGasFeeParams) => {
    const { data: transactionCost, isLoading: isEstimatingFee } =
        useGetTransactionCost(
            orderId,
            MarketplaceAction.EXECUTE_ORDER,
            shouldEstimateFee
        );

    const { balance: ethBalance, isLoading: isLoadingEthBalance } = useBalance({
        address: account,
        assetId: ETH_ID,
    });

    const canUserPayTheGasFee = useMemo(() => {
        if (isEstimatingFee || isLoadingEthBalance) return false;

        if (ethBalance?.eq(bn(0)) || !ethBalance || !transactionCost?.fee.gt(bn(0)))
            return false;

        return ethBalance?.gt(transactionCost?.fee);
    }, [ethBalance, transactionCost, isEstimatingFee, isLoadingEthBalance]);

    return {
        canUserPayTheGasFee,
        isEstimatingFee,
        isLoadingEthBalance,
        ethBalance,
        transactionCost,
    };
};
