import { getInitialOrders } from '@/helpers/getInitialOrders';
import { FuelAssetService } from '@/services/fuel-assets';
import { parseURI } from '@/utils';
import { ResolverContract } from '@bako-id/sdk';
import { Provider } from 'fuels';
import type { Metadata } from 'next';
import { getResolver } from '../../api/[network]/addr/[name]/resolver';
import { ProfilePage } from './page-component';

type Props = {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const domain = (await params).domain.replace('@', '');
  const resolver = await getResolver(domain, 'mainnet');

  if (!resolver) {
    return {
      title: `Bako Identity - @${domain}`,
      description: 'Embrace your digital legacy',
    };
  }

  const { data: assets } = await FuelAssetService.byAddress({
    address: resolver,
    chainId: 9889,
  });
  const bakoIdAsset = assets.find((asset) => asset.name?.includes(domain));

  if (!bakoIdAsset) {
    return {
      title: `@${domain} | Bako Identity`,
      description: 'Embrace your digital legacy',
    };
  }

  return {
    title: `@${domain} | Bako Identity`,
    description:
      bakoIdAsset.metadata?.['contact:bio'] ?? 'Embrace your digital legacy',
    twitter: {
      card: 'summary_large_image',
      description:
        bakoIdAsset.metadata?.['contact:bio'] ?? 'Embrace your digital legacy',
      title: `@${domain} | Bako Identity`,
      images: [
        parseURI(
          bakoIdAsset.metadata?.avatar ??
            bakoIdAsset.metadata?.['image:png'] ??
            ''
        ),
      ],
      siteId: `@${domain}`,
    },
    openGraph: {
      images: [
        parseURI(
          bakoIdAsset.metadata?.avatar ??
            bakoIdAsset.metadata?.['image:png'] ??
            ''
        ),
      ],
      description:
        bakoIdAsset.metadata?.['contact:bio'] ?? 'Embrace your digital legacy',
      username: bakoIdAsset.metadata?.['contact:nickname'] ?? domain,
      title: `@${bakoIdAsset.metadata?.['contact:nickname'] ?? domain} | Bako Identity`,
      url: `https://bako.id/${domain}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const provider = new Provider(process.env.NEXT_PUBLIC_PROVIDER_URL!);
  const chainId = await provider.getChainId();
  const domain = (await params).domain.replace('@', '');
  const resolver = ResolverContract.create(provider);
  const resolverAddress = await resolver.addr(domain);

  const address =
    resolverAddress?.Address?.bits || resolverAddress?.ContractId?.bits;

  const ordersPage = Number((await searchParams).page ?? 1);
  const initialOrders = await getInitialOrders(address, chainId, ordersPage);

  return <ProfilePage chainId={chainId} initialOrders={initialOrders} />;
}
