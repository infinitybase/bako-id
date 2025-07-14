import { getOrder } from '@/helpers/queries';
import { Provider } from 'fuels';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Redirect from './Redirect';

type Params = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ collectionId?: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { orderId } = await params;
  const provider = new Provider(process.env.NEXT_PUBLIC_PROVIDER_URL!);
  const chainId = await provider.getChainId();

  const order = await getOrder(chainId, orderId);

  if (!order) {
    return notFound();
  }

  const itemPrice = order.price.amount;
  const assetSymbol = order.price.symbol;
  const title = `${order.asset.name} | ${itemPrice} ${assetSymbol} | Bako Identity`;
  const description =
    order.asset.metadata.description || 'Explore this NFT on Bako Identity';

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: order.asset.image,
    },
    twitter: {
      title,
      description,
      images: order.asset.image,
      card: 'summary_large_image',
    },
  };
  return metadata;
}

export default async function Page({ params, searchParams }: Params) {
  const { orderId } = await params;
  const { collectionId } = await searchParams;
  return <Redirect orderId={orderId} collectionId={collectionId ?? ''} />;
}
