import { Icon } from '@chakra-ui/react';

import { Flex } from '@chakra-ui/react';
import { CopyText } from '@/components/helpers/copy';
import { GlobalIcon } from './icons';
import { TwitterIcon } from './icons';
import { DiscordIcon as DiscordIconComponent } from '@/components/icons/discordIcon';
import { ShareMenu } from './banner/shareMenu';
import type { Collection } from '@/types/marketplace';

export const SocialActionsMenu = ({
  collection,
}: { collection: Collection }) => {
  const discordLink = collection.config.social?.discord;
  const xLink = collection.config.social?.x;
  const siteLink = collection.config.social?.site;

  const handleRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Flex
      gap={4}
      mt="auto"
      onClick={(e) => e.stopPropagation()}
      alignItems="center"
    >
      <CopyText useNewCopyIcon value={collection.id} color="grey.200" />
      <Icon
        as={GlobalIcon}
        color="grey.200"
        cursor={siteLink ? 'pointer' : 'default'}
        pointerEvents={siteLink ? 'auto' : 'none'}
        onClick={(e) => {
          e.stopPropagation();
          handleRedirect(siteLink ?? '');
        }}
      />
      <Icon
        as={TwitterIcon}
        color="grey.200"
        cursor={xLink ? 'pointer' : 'default'}
        pointerEvents={xLink ? 'auto' : 'none'}
        onClick={(e) => {
          e.stopPropagation();
          handleRedirect(xLink ?? '');
        }}
      />
      <Icon
        as={DiscordIconComponent}
        w={5}
        h={5}
        color="grey.200"
        cursor={discordLink ? 'pointer' : 'default'}
        pointerEvents={discordLink ? 'auto' : 'none'}
        onClick={(e) => {
          e.stopPropagation();
          handleRedirect(discordLink ?? '');
        }}
      />
      <ShareMenu discordLink={discordLink} xLink={xLink} />
    </Flex>
  );
};
