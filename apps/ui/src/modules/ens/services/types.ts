import { MetadataKeys } from '@bako-id/sdk';

export enum ENSMetadataKeys {
  SOCIAL_X = 'com.twitter',
  SOCIAL_GITHUB = 'com.github',
  SOCIAL_DISCORD = 'com.discord',
  SOCIAL_TELEGRAM = 'org.telegram',

  CONTACT_WEBSITE = 'url',
  CONTACT_NICKNAME = 'name',
  CONTACT_EMAIL = 'email',
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
