import { fetchMetadata } from '@/utils/formatter';
import type { BN } from 'fuels';

export type TransactionResultLog = {
    asset: {
        bits: string;
    };
    key: string;
    metadata: Record<string, string>;
};

export type MintedAssetsTransaction = {
    transactionId: string;
    mintedAssets: {
        name: string | null;
        image: string | null;
        id: string;
    }[];
};
export type FuelReceipt = {
    rb: BN;
    data: string;
};


export const getMintedAssets = async (logs: TransactionResultLog[]) => {
    const uriLogs = logs.filter((log) => log.key === 'uri');
    const imageLogs = logs.filter((log) => log.key === 'image');

    const uniqueImageAssets = Array.from(
        new Map(imageLogs.map(log => [log.asset.bits, log])).values()
    );


    const uniqueUriAssets = Array.from(
        new Map(uriLogs.map(log => [log.asset.bits, log])).values()
    );

    const getNameFromKey = (key: string) => {
        return key.split('/').pop()?.replace(/\D/g, '') || null;
    }


    const mintedAssets = uniqueImageAssets.map(log => {
        const imageUrl = log.metadata.String;
        return ({
            image: imageUrl,
            name: getNameFromKey(imageUrl),
            id: log.asset.bits,
        })
    });

    const missingImageAssets = uniqueUriAssets.filter(uriLog =>
        !uniqueImageAssets.some(imageLog => imageLog.asset.bits === uriLog.asset.bits)
    );

    if (missingImageAssets.length > 0) {
        const fetchedAssets = await Promise.all(
            missingImageAssets.map(async (uriLog) => {
                const metadata = await fetchMetadata(uriLog.metadata.String);
                return {
                    image: metadata.image ?? null,
                    name: getNameFromKey(uriLog.metadata.String),
                    id: uriLog.asset.bits,
                };
            })
        );

        mintedAssets.push(...fetchedAssets);
    }

    return mintedAssets;
};
