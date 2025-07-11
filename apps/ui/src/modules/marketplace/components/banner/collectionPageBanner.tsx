import { Box, Flex, Stack } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Collection } from '@/types/marketplace';
import { CollectionPageDetails } from './collectionPageDetails';
import { ImageLoader } from '@/components/imageLoader';

type MarketplaceBannerProps = {
  collection: Collection;
};

export const CollectionPageBanner = ({
  collection,
}: MarketplaceBannerProps) => {
  const hasBanner = !!collection?.config?.banner;

  return (
    <Stack gap={4}>
      <Box height="250px" borderRadius="8px">
        <Box w="full" h="full" position="relative">
          <ImageLoader
            src={
              hasBanner
                ? (collection?.config?.banner ?? '')
                : (collection?.config?.avatar ?? '')
            }
            alt={collection?.name ?? ''}
            skeletonProps={{
              boxSize: 'full',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              cursor: 'pointer',
            }}
            imageProps={{
              objectFit: 'cover',
              objectPosition: 'center',
              boxSize: 'full',
            }}
          />
          <Flex
            position="relative"
            h="full"
            mt="auto"
            zIndex={3}
            align="center"
            px={4}
            justify="space-between"
            alignItems="flex-end"
            bgGradient="linear(0deg, rgba(21,20,19,0.85) 0%, rgba(21,20,19,0.00) 100%)"
            backdropFilter={hasBanner ? 'blur(0px)' : 'blur(80px)'}
          >
            <CollectionPageDetails collection={collection} />
          </Flex>
        </Box>
      </Box>
    </Stack>
  );
};
