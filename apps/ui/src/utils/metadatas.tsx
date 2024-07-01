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

export const Metadatas = {
  General: [
    {
      key: 'nickname',
      title: 'Nickname',
      icon: <UserIcon w={7} h={7} />,
      description: 'Your display name',
      validated: true,
    },
    {
      key: 'shortBio',
      title: 'Short bio',
      icon: <BioIcon w={7} h={7} />,
      description: 'A brief description about you',
      validated: null,
    },
    {
      key: 'website',
      title: 'Website',
      icon: <WebsiteIcon w={7} h={7} />,
      description: 'Your personal or professional website',
      validated: false,
    },
    {
      key: 'location',
      title: 'Location',
      icon: <LocationIcon w={7} h={7} />,
      description: 'Your current location',
      validated: null,
    },
  ],
  Social: [
    {
      key: 'twitter',
      title: 'Twitter',
      icon: <TwitterIcon w={7} h={7} />,
      description: 'Your Twitter handle',
      validated: false,
    },
    {
      key: 'farcaster',
      title: 'Farcaster',
      icon: <FarcasterIcon w={7} h={7} />,
      description: 'Your Farcaster handle',
      validated: false,
    },
    {
      key: 'github',
      title: 'Github',
      icon: <GithubIcon w={10} h={10} />,
      description: 'Your GitHub profile',
      validated: null,
    },
    {
      key: 'discord',
      title: 'Discord',
      icon: <DiscordIcon w={10} h={10} />,
      description: 'Your Discord username',
      validated: false,
    },
    {
      key: 'telegram',
      title: 'Telegram',
      icon: <TelegramIcon w={10} h={10} />,
      description: 'Your Telegram handle',
      validated: true,
    },
    {
      key: 'email',
      title: 'E-mail',
      icon: <MailIcon w={7} h={7} />,
      description: 'Your email address',
      validated: false,
    },
  ],
  Address: [
    {
      key: 'location',
      title: 'Location',
      icon: <LocationIcon w={7} h={7} />,
      description: 'Your current location',
      validated: true,
    },
  ],
  Website: [
    {
      key: 'website',
      title: 'Website',
      icon: <WebsiteIcon w={7} h={7} />,
      description: 'Your personal or professional website',
      validated: false,
    },
  ],
  Other: [],
};
