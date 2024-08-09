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
      key: 'contact:nickname',
      title: 'Nickname',
      icon: <UserIcon w={7} h={7} />,
      description: 'Your display name',
      validated: true,
    },
    {
      key: 'contact:bio',
      title: 'Short bio',
      icon: <BioIcon w={7} h={7} />,
      description: 'A brief description about you',
      validated: null,
    },
    {
      key: 'link:website',
      title: 'Website',
      icon: <WebsiteIcon w={7} h={7} />,
      description: 'Your personal or professional website',
      validated: false,
    },
    {
      key: 'contact:location',
      title: 'Location',
      icon: <LocationIcon w={7} h={7} />,
      description: 'Your current location',
      validated: null,
    },
  ],
  Social: [
    {
      key: 'social:x',
      title: 'Twitter',
      icon: <TwitterIcon w={7} h={7} />,
      description: 'Your Twitter handle',
      validated: false,
    },
    {
      key: 'social:farcaster',
      title: 'Farcaster',
      icon: <FarcasterIcon w={7} h={7} />,
      description: 'Your Farcaster handle',
      validated: false,
    },
    {
      key: 'social:github',
      title: 'Github',
      icon: <GithubIcon w={7} h={7} />,
      description: 'Your GitHub profile',
      validated: null,
    },
    {
      key: 'social:discord',
      title: 'Discord',
      icon: <DiscordIcon w={7} h={7} />,
      description: 'Your Discord username',
      validated: false,
    },
    {
      key: 'social:telegram',
      title: 'Telegram',
      icon: <TelegramIcon w={7} h={7} />,
      description: 'Your Telegram handle',
      validated: true,
    },
    {
      key: 'social:email',
      title: 'E-mail',
      icon: <MailIcon w={7} h={7} />,
      description: 'Your email address',
      validated: false,
    },
  ],
  Address: [
    {
      key: 'contact:location',
      title: 'Location',
      icon: <LocationIcon w={7} h={7} />,
      description: 'Your current location',
      validated: true,
    },
  ],
  Website: [
    {
      key: 'link:website',
      title: 'Website',
      icon: <WebsiteIcon w={7} h={7} />,
      description: 'Your personal or professional website',
      validated: false,
    },
  ],
  Other: [],
};
