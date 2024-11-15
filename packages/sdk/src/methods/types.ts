export enum ENSMetadataKeys {
  SOCIAL_X = 'com.twitter',
  SOCIAL_GITHUB = 'com.github',
  SOCIAL_DISCORD = 'com.discord',
  SOCIAL_TELEGRAM = 'org.telegram',

  CONTACT_WEBSITE = 'url',
  CONTACT_NICKNAME = 'name',
  CONTACT_EMAIL = 'email',
}

export enum MetadataKeys {
  SOCIAL_DISCORD = 'social:discord',
  SOCIAL_FACEBOOK = 'social:facebook',
  SOCIAL_FARCASTER = 'social:farcaster',
  SOCIAL_FRIEND_TECH = 'social:friend.tech',
  SOCIAL_GITHUB = 'social:github',
  SOCIAL_INSTAGRAM = 'social:instagram',
  SOCIAL_LENS = 'social:lens',
  SOCIAL_LINKEDIN = 'social:linkedin',
  SOCIAL_REDDIT = 'social:reddit',
  SOCIAL_SIGNAL = 'social:signal',
  SOCIAL_TELEGRAM = 'social:telegram',
  SOCIAL_TIKTOK = 'social:tiktok',
  SOCIAL_X = 'social:x',
  SOCIAL_WECHAT = 'social:wechat',
  SOCIAL_WHATSAPP = 'social:whatsapp',
  SOCIAL_YOUTUBE = 'social:youtube',

  CONTACT_EMAIL = 'contact:email',
  CONTACT_MAILING = 'contact:mailing',
  CONTACT_PHONE = 'contact:phone',
  CONTACT_COMPANY = 'contact:company',
  CONTACT_NICKNAME = 'contact:nickname',
  CONTACT_BIO = 'contact:bio',
  CONTACT_WEBSITE = 'contact:website',
  CONTACT_LOCATION = 'contact:location',

  LINK_HOME = 'link:home',
  LINK_CONTACT = 'link:contact',
  LINK_DOCS = 'link:docs',
  LINK_FORUM = 'link:forum',
  LINK_BLOG = 'link:blog',
  LINK_LINKTREE = 'link:linktree',

  RES_LICENSE = 'res:license',
  RES_TOS = 'res:tos',
  RES_AUTHOR = 'res:author',
  RES_ABOUT = 'res:about',
  RES_DESCRIPTION = 'res:description',
  RES_DATE = 'res:date',
  RES_BLOCK = 'res:block',
}

export const ensToMetadataMap: Record<ENSMetadataKeys, MetadataKeys> = {
  [ENSMetadataKeys.SOCIAL_X]: MetadataKeys.SOCIAL_X,
  [ENSMetadataKeys.SOCIAL_GITHUB]: MetadataKeys.SOCIAL_GITHUB,
  [ENSMetadataKeys.SOCIAL_DISCORD]: MetadataKeys.SOCIAL_DISCORD,
  [ENSMetadataKeys.SOCIAL_TELEGRAM]: MetadataKeys.SOCIAL_TELEGRAM,
  [ENSMetadataKeys.CONTACT_WEBSITE]: MetadataKeys.CONTACT_WEBSITE,
  [ENSMetadataKeys.CONTACT_NICKNAME]: MetadataKeys.CONTACT_NICKNAME,
  [ENSMetadataKeys.CONTACT_EMAIL]: MetadataKeys.CONTACT_EMAIL,
};
