import { getOrderMetadata } from '@/helpers/getOrderMetadata';
import { getOrder } from '@/helpers/queries';
import { ResolverContract } from '@bako-id/sdk';
import { Provider } from 'fuels';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ orderId: string; domain: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { orderId, domain } = await params;
  const provider = new Provider(process.env.NEXT_PUBLIC_PROVIDER_URL!);
  const chainId = await provider.getChainId();
  const resolver = ResolverContract.create(provider);
  const resolverResponse = await resolver.addr(domain.replace('@', ''));
  const address =
    resolverResponse?.Address?.bits || resolverResponse?.ContractId?.bits;

  if (!address) {
    return notFound();
  }

  const order = await getOrder(address, orderId, chainId);

  if (!order) {
    return notFound();
  }
  const orderWithMetadata = await getOrderMetadata(order, chainId);

  const title = `${orderWithMetadata.nft.metadata.name} | Bako Identity`;
  const description =
    orderWithMetadata.nft.metadata.description ||
    'Explore this NFT on Bako Identity';

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: orderWithMetadata.nft.metadata.image,
    },
  };
  return metadata;
}

// const BAKO_MARKETPLACE_URL =
//   process.env.NEXT_PUBLIC_BAKO_MARKETPLACE_URL || 'https://localhost:5173';

export default async function Page({ params }: Params) {
  const { orderId } = await params;
  console.log('Order ID:', orderId);
  // Maybe redirect in middleware
  // redirect(`${BAKO_MARKETPLACE_URL}/marketplace/order/${orderId}`);
  return null;
}
