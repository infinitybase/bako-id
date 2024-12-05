import { MetadataKeys } from '@bako-id/sdk';
import {
  BioIcon,
  DiscordIcon,
  FarcasterIcon,
  GithubIcon,
  LocationIcon,
  MailIcon,
  TelegramIcon,
  TwitterIcon,
  UserIcon,
  WebsiteIcon,
} from '../components/icons/';

export const getMetadataRedirects = (
  key: MetadataKeys,
  value: string,
): string | null => {
  const metaDatas: Partial<Record<MetadataKeys, string>> = {
    'social:x': `https://x.com/${value}`,
    'social:github': `https://github.com/${value}`,
    'social:telegram': `https://t.me/${value}`,
    'contact:website': value,
    'ens:domain': `https://app.ens.domains/${value}`,
  };

  return metaDatas[key] || null;
};

export type MetadataItem = {
  key: MetadataKeys;
  title: string;
  icon: JSX.Element;
  description: string;
  validated: boolean | null;
};

type Metadatas = {
  [key: string]: MetadataItem[];
};

export const Metadatas: Metadatas = {
  General: [
    {
      key: MetadataKeys.CONTACT_NICKNAME,
      title: 'Nickname',
      icon: <UserIcon w={7} h={7} />,
      description: 'Your display name',
      validated: true,
    },
    {
      key: MetadataKeys.CONTACT_BIO,
      title: 'Short bio',
      icon: <BioIcon w={7} h={7} />,
      description: 'A brief description about you',
      validated: null,
    },
    {
      key: MetadataKeys.CONTACT_WEBSITE,
      title: 'Website',
      icon: <WebsiteIcon w={7} h={7} />,
      description: 'Your personal or professional website',
      validated: false,
    },
    {
      key: MetadataKeys.CONTACT_LOCATION,
      title: 'Location',
      icon: <LocationIcon w={7} h={7} />,
      description: 'Your current location',
      validated: null,
    },
  ],
  Social: [
    {
      key: MetadataKeys.SOCIAL_X,
      title: 'Twitter',
      icon: <TwitterIcon w={7} h={7} />,
      description: 'Your Twitter handle',
      validated: false,
    },
    {
      key: MetadataKeys.SOCIAL_FARCASTER,
      title: 'Farcaster',
      icon: <FarcasterIcon w={7} h={7} />,
      description: 'Your Farcaster handle',
      validated: false,
    },
    {
      key: MetadataKeys.SOCIAL_GITHUB,
      title: 'Github',
      icon: <GithubIcon w={7} h={7} />,
      description: 'Your GitHub profile',
      validated: null,
    },
    {
      key: MetadataKeys.SOCIAL_DISCORD,
      title: 'Discord',
      icon: <DiscordIcon w={7} h={7} />,
      description: 'Your Discord username',
      validated: false,
    },
    {
      key: MetadataKeys.SOCIAL_TELEGRAM,
      title: 'Telegram',
      icon: <TelegramIcon w={7} h={7} />,
      description: 'Your Telegram handle',
      validated: true,
    },
    {
      key: MetadataKeys.CONTACT_EMAIL,
      title: 'E-mail',
      icon: <MailIcon w={7} h={7} />,
      description: 'Your email address',
      validated: false,
    },
  ],
  Address: [
    {
      key: MetadataKeys.CONTACT_LOCATION,
      title: 'Location',
      icon: <LocationIcon w={7} h={7} />,
      description: 'Your current location',
      validated: true,
    },
  ],
  Website: [
    {
      key: MetadataKeys.CONTACT_WEBSITE,
      title: 'Website',
      icon: <WebsiteIcon w={7} h={7} />,
      description: 'Your personal or professional website',
      validated: false,
    },
  ],
  Other: [],
};
