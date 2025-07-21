import type { Collection } from '@/types/marketplace';
import { Flex, Heading } from '@chakra-ui/react';
import { ImageLoader } from '@/components/imageLoader';
import { usdValueFormatter } from '@/utils/formatter';
import { BannerRoot } from '.';

const CollectionContent = ({ collection }: { collection: Collection }) => {
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
        <Flex gap={4} align="center" mt="auto">
          <Heading fontSize="2xl" fontWeight={700} color="#fff" noOfLines={1}>
            {collection.name}
          </Heading>

          <BannerRoot.DetailsMenu collection={collection} />
          <BannerRoot.SocialActionsMenu collection={collection} />
        </Flex>
      </Flex>

      <Flex gap={4}>
        <BannerRoot.StatBox label="Sales" value={collection.metrics.sales} />
        <BannerRoot.StatBox
          label="Floor price"
          value={usdValueFormatter(collection.metrics.floorPrice ?? 0)}
        />
        <BannerRoot.StatBox
          label="Volume"
          value={usdValueFormatter(collection.metrics.volume ?? 0)}
        />
      </Flex>
    </Flex>
  );
};

export { CollectionContent };
