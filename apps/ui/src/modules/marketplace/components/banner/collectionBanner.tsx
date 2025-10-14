import { Box, Stack } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { ImageLoader } from '@/components/imageLoader';
import type { Collection } from '@/types/marketplace';
import { BannerRoot } from './root';

type MarketplaceBannerProps = {
  collection: Collection;
  stillMintable: boolean;
};

export const CollectionPageBanner = ({
  collection,
  stillMintable,
}: MarketplaceBannerProps) => {
  const hasBanner = !!collection?.config?.banner;

  return (
    <Stack
      gap={4}
      w={{ base: 'calc(100% - 23px)', sm: 'full' }}
      mx="auto"
      borderRadius="8px"
    >
      <Box
        height="350px"
        position="relative"
        borderRadius={{ base: '8px', sm: '0' }}
        overflow="hidden"
      >
        <Box
          w="full"
          h="full"
          position="absolute"
          top={0}
          left={0}
          onClick={(e) => {
            e.stopPropagation();
          }}
          zIndex={1}
        >
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
            }}
            imageProps={{
              objectFit: 'cover',
              objectPosition: 'center',
              boxSize: 'full',
            }}
          />
        </Box>

        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="full"
          bgGradient="linear-gradient(0deg, rgba(21, 20, 19, 0.85) 0%, rgba(21, 20, 19, 0) 100%)"
          zIndex={2}
          onClick={(e) => {
            e.stopPropagation();
          }}
          _before={
            !hasBanner
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 'full',
                  backdropFilter: 'blur(80px)',
                  pointerEvents: 'none',
                }
              : undefined
          }
        />

        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={3}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BannerRoot.CollectionContent
            collection={collection}
            stillMintable={stillMintable}
          />
        </Box>
      </Box>
    </Stack>
  );
};
