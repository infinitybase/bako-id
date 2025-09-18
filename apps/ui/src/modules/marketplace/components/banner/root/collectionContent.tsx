import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { usdValueFormatter } from '@/utils/formatter';
import { Box, Flex, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import { BannerRoot } from '.';

const CollectionContent = ({
  collection,
  stillMintable,
}: {
  collection: Collection;
  stillMintable: boolean;
}) => {
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
          <Flex flexDir="column" gap={1}>
            {stillMintable && (
              <Text
                bg="#B3FF2E1A"
                borderRadius="100px"
                w="fit-content"
                py={1}
                px={4}
                backdropBlur="blur(24px)"
                color="garage.100"
                letterSpacing="0.05em"
                fontSize="10px"
                border="1px solid #B3FF2E40"
                boxShadow="0px 6px 12px 0px #00000040"
                bgGradient="linear(to-r, #00000040, #00000040)"
                mb={1}
              >
                Now Minting
              </Text>
            )}
            <Heading fontSize="2xl" fontWeight={700} color="#fff" noOfLines={1}>
              {collection.name}
            </Heading>
          </Flex>

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
