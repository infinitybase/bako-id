import { Icon } from '@chakra-ui/react';

import { Flex } from '@chakra-ui/react';
import { CopyText } from '@/components/helpers/copy';

import { DiscordIcon as DiscordIconComponent } from '@/components/icons/discordIcon';
import { ShareMenu } from './shareMenu';
import type { Collection } from '@/types/marketplace';
import { TwitterIcon } from '../../icons/twitterIcon';
import { GlobalIcon } from '../../icons';

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
      {siteLink && (
        <Icon
          as={GlobalIcon}
          color="grey.200"
          cursor="pointer"
          pointerEvents="auto"
          _hover={{ color: 'white' }}
          transition="color 0.2s"
          onClick={(e) => {
            e.stopPropagation();
            handleRedirect(siteLink ?? '');
          }}
        />
      )}
      {xLink && (
        <Icon
          as={TwitterIcon}
          color="grey.200"
          cursor="pointer"
          pointerEvents="auto"
          _hover={{ color: 'white' }}
          transition="color 0.2s"
          onClick={(e) => {
            e.stopPropagation();
            handleRedirect(xLink ?? '');
          }}
        />
      )}
      {discordLink && (
        <Icon
          as={DiscordIconComponent}
          w={5}
          h={5}
          color="grey.200"
          cursor="pointer"
          pointerEvents="auto"
          _hover={{ color: 'white' }}
          transition="color 0.2s"
          onClick={(e) => {
            e.stopPropagation();
            handleRedirect(discordLink ?? '');
          }}
        />
      )}

      <ShareMenu
        collectionIdOrSlug={collection.id}
        collectionName={collection.name}
      />
    </Flex>
  );
};
