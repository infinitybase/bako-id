import type { Collection } from '@/types/marketplace';
import { Flex, VStack, Heading, Icon } from '@chakra-ui/react';
import { CopyText } from '@/components/helpers/copy';
import { GlobalIcon, TwitterIcon } from '../icons';
import { DiscordIcon as DiscordIconComponent } from '@/components/icons/discordIcon';
import { ShareMenu } from './shareMenu';
import { DetailsMenu } from './detailsMenu';
import { StatBox } from './statBox';
import { ImageLoader } from '@/components/imageLoader';

const CollectionPageDetails = ({ collection }: { collection: Collection }) => {
  if (!collection) return null;

  return (
    <Flex
      zIndex={3}
      h="full"
      w="full"
      align="center"
      justify="space-between"
      alignItems="flex-end"
      mb={2.5}
    >
      <Flex align="center" gap={2} minW="0">
        <ImageLoader
          skeletonProps={{
            boxSize: '62px',
            borderRadius: '8px',
          }}
          src={collection.config.avatar}
          alt={'Collection Image'}
          imageProps={{
            boxSize: '60px',
            borderRadius: '8px',
          }}
        />

        <VStack align="flex-start" spacing={0} minW="0" mt="auto">
          <Flex gap={4} align="center">
            <Heading fontSize="2xl" fontWeight={700} color="#fff" noOfLines={1}>
              {collection.name}
            </Heading>
            <Flex gap={4} mt={1}>
              <DetailsMenu collection={collection} />
              <CopyText useNewCopyIcon value={collection.id} color="grey.200" />
              <Icon as={GlobalIcon} color="grey.200" />
              <Icon as={TwitterIcon} color="grey.200" />
              <Icon as={DiscordIconComponent} w={5} h={5} color="grey.200" />
              <ShareMenu />
            </Flex>
          </Flex>
        </VStack>
      </Flex>

      <Flex gap={4}>
        <StatBox label="Sales" value={collection.metrics.sales} />
        <StatBox
          label="Floor price"
          value={`${collection.metrics.floorPrice} ETH`}
        />
        <StatBox label="Volume" value={`${collection.metrics.volume} ETH`} />
      </Flex>
    </Flex>
  );
};

export { CollectionPageDetails };
