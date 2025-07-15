import { Box, Stack } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Collection } from '@/types/marketplace';
import { CollectionPageDetails } from './collectionPageDetails';
import { ImageLoader } from '@/components/imageLoader';
import { useNavigate } from '@tanstack/react-router';

type MarketplaceBannerProps = {
  collection: Collection;
};

export const CollectionPageBanner = ({
  collection,
}: MarketplaceBannerProps) => {
  const hasBanner = !!collection?.config?.banner;
  const navigate = useNavigate();

  return (
    <Stack gap={4}>
      <Box height="250px" borderRadius="8px" position="relative">
        <Box
          w="full"
          h="full"
          position="absolute"
          top={0}
          left={0}
          onClick={(e) => {
            e.stopPropagation();
            navigate({ to: '/' });
          }}
          cursor="pointer"
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
              zIndex: 1,
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
          height="80px"
          bgGradient="linear(0deg, rgba(21,20,19,0.85) 0%, rgba(21,20,19,0.00) 100%)"
          zIndex={2}
          _before={
            !hasBanner
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '250px',
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
          px={4}
        >
          <CollectionPageDetails collection={collection} />
        </Box>
      </Box>
    </Stack>
  );
};
