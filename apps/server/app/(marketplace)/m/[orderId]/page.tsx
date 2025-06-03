import { getOrderMetadata } from '@/helpers/getOrderMetadata';
import { getOrder } from '@/helpers/queries';
import { removeRightZeros } from '@/utils';
import { Provider, bn } from 'fuels';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ orderId: string; domain: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { orderId } = await params;
  const provider = new Provider(process.env.NEXT_PUBLIC_PROVIDER_URL!);
  const chainId = await provider.getChainId();
  const order = await getOrder(orderId, chainId);

  if (!order) {
    return notFound();
  }
  const orderWithMetadata = await getOrderMetadata(order, chainId);

  const itemPrice = bn(orderWithMetadata.itemPrice).formatUnits(
    orderWithMetadata.asset?.decimals
  );
  const value = removeRightZeros(itemPrice);
  const assetSymbol = orderWithMetadata.asset?.symbol;
  const title = `${orderWithMetadata.nft.metadata.name} | ${value} ${assetSymbol} | Bako Identity`;
  const description =
    orderWithMetadata.nft.metadata.description ||
    'Explore this NFT on Bako Identity';

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: orderWithMetadata.nft.image,
    },
    twitter: {
      title,
      description,
      images: orderWithMetadata.nft.image,
      card: 'summary_large_image',
    },
  };
  return metadata;
}

export default async function Page() {
  // const { orderId } = await params;
  // Maybe redirect in middleware
  // redirect(`${BAKO_MARKETPLACE_URL}/marketplace/order/${orderId}`);
  return null;
}
