
import { marketplaceService } from '@/services/marketplace';

export const getOrder = async (chainId: number, orderId: string) => {
  const { data } = await marketplaceService.getOrder({
    orderId,
    chainId,
  });

  return data;
};
