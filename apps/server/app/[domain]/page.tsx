import { FuelAssetService } from '@/services/fuel-assets';
import type { Metadata } from 'next';
import { getResolver } from '../api/[network]/addr/[name]/resolver';
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
    openGraph: {
      images: [
        bakoIdAsset.metadata?.avatar ??
          bakoIdAsset.metadata?.['image:png'] ??
          '',
      ],
      description:
        bakoIdAsset.metadata?.['contact:bio'] ?? 'Embrace your digital legacy',
      username: bakoIdAsset.metadata?.['contact:nickname'] ?? domain,
      title: `@${bakoIdAsset.metadata?.['contact:nickname'] ?? domain} | Bako Identity`,
      url: bakoIdAsset.metadata?.['contact:website'] ?? '',
    },
  };
}

export default function Page() {
  return <ProfilePage />;
}
