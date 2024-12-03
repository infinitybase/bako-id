import { FuelAssetService } from '@/services/fuel-assets';
import type { Metadata } from 'next';
import { getResolver } from '../../[network]/addr/[name]/resolver';
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
    };
  }

  const assets = await FuelAssetService.byAddress({
    address: resolver,
    chainId: 9889,
  });
  const bakoIdAsset = assets.find((asset) => asset.name?.includes(domain));

  if (!bakoIdAsset) {
    return {
      title: `@${domain} | Bako Identity`,
    };
  }

  return {
    title: `@${domain} | Bako Identity`,
    openGraph: {
      images: [
        bakoIdAsset.metadata?.avatar ??
          bakoIdAsset.metadata?.['image:png'] ??
          '',
      ],
      description: bakoIdAsset.metadata?.['contact:bio'] ?? '',
      username: bakoIdAsset.metadata?.['contact:nickname'] ?? domain,
      title: `@${bakoIdAsset.metadata?.['contact:nickname'] ?? domain} | Bako Identity`,
      url: bakoIdAsset.metadata?.['contact:website'] ?? '',
    },
  };
}

export default function Page() {
  return <ProfilePage />;
}
