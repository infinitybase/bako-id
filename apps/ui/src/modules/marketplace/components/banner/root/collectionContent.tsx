import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { usdValueFormatter } from '@/utils/formatter';
import { Box, Flex, Heading, useMediaQuery } from '@chakra-ui/react';
import { BannerRoot } from '.';

const CollectionContent = ({ collection }: { collection: Collection }) => {
  const [isMobile] = useMediaQuery('(min-width: 320px) and (max-width: 767px)');

  if (!collection) return null;

  return (
    <Flex
      flexDir={{ base: 'column', sm: 'row' }}
      zIndex={3}
      h="full"
      align={{ base: 'start', sm: 'center' }}
      justify="space-between"
      alignItems="flex-end"
      mb={2.5}
      maxW="1280px"
      px="23px"
      mx="auto"
      gap={{ base: 4, sm: 0 }}
    >
      <Flex align="center" gap={2} minW="0" w={{ base: 'full', sm: 'auto' }}>
        <ImageLoader
          skeletonProps={{
            boxSize: '62px',
          }}
          src={collection.config.avatar}
          alt={'Collection Image'}
          imageProps={{
            boxSize: '60px',
          }}
        />
        <Flex gap={4} align="center" mt="auto">
          <Heading fontSize="2xl" fontWeight={700} color="#fff" noOfLines={1}>
            {collection.name}
          </Heading>

          {!isMobile && (
            <>
              <BannerRoot.DetailsMenu collection={collection} />
              <BannerRoot.SocialActionsMenu collection={collection} />
            </>
          )}
        </Flex>
      </Flex>

      <Flex gap={4} w={{ base: 'full', sm: 'auto' }}>
        <BannerRoot.StatBox label="Items" value={collection.metrics.sales} />
        <BannerRoot.StatBox
          label="Floor price"
          value={usdValueFormatter(collection.metrics.floorPrice ?? 0)}
        />
        <BannerRoot.StatBox
          label="Volume"
          value={usdValueFormatter(collection.metrics.volume ?? 0)}
        />

        {isMobile && (
          <Box ml="auto" mt="auto">
            <BannerRoot.DetailsMenu collection={collection} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export { CollectionContent };
