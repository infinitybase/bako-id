import { FuelAssetService } from '@/services/fuel-assets';
import { BakoIDClient } from '@bako-id/sdk';
import type { Metadata } from 'next';
import { ProfilePage } from './page-component';

type Props = {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const domain = (await params).domain.replace('@', '');
  const client = new BakoIDClient(process.env.NEXT_PUBLIC_PROVIDER_URL!);
  const resolver = await client.resolver(domain);

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
      title: `Bako Identity - @${domain}`,
    };
  }

  return {
    title: `Bako ID - @${domain}`,
    openGraph: {
      images: [
        bakoIdAsset.metadata?.avatar ??
          bakoIdAsset.metadata?.['image:png'] ??
          '',
      ],
      description: bakoIdAsset.metadata?.['contact:bio'] ?? '',
    },
  };
}

export default function Page() {
  return <ProfilePage />;
}
