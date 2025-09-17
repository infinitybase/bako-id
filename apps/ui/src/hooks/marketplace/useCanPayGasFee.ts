import { useMemo } from 'react';
import { useBalance } from '@fuels/react';
import { bn } from 'fuels';
import { ETH_ID } from '@/utils/constants';
import { useGetTransactionCost } from './useGetTransactionCost';
import { MarketplaceAction } from '@bako-id/marketplace';
import type { Order as OrderFromFuel } from '@bako-id/marketplace';

interface UseCanPayGasFeeParams {
    orderId: string;
    account: string | null;
    shouldEstimateFee: boolean;
    orderData?: OrderFromFuel
    actionToSimulate: MarketplaceAction
}

export const useCanPayGasFee = ({
    actionToSimulate = MarketplaceAction.EXECUTE_ORDER,
    orderId,
    account,
    shouldEstimateFee,
    orderData,
}: UseCanPayGasFeeParams) => {

    const { data: transactionCost, isLoading: isEstimatingFee } =
        useGetTransactionCost(
            orderId,
            actionToSimulate,
            shouldEstimateFee,
            orderData
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
