import nftEmpty from '@/assets/nft-empty.png';
import { Box, Flex, Image, Skeleton, Stack } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { parseURI } from '@/utils/formatter';
import type { Collection } from '@/types/marketplace';
import { CollectionPageDetails } from './collectionPageDetails';
import { useState } from 'react';

type MarketplaceBannerProps = {
  collection: Collection;
};

export const CollectionPageBanner = ({
  collection,
}: MarketplaceBannerProps) => {
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const hasBanner = !!collection?.config?.banner;

  return (
    <Stack gap={4}>
      <Box position="relative" height="250px" borderRadius="8px">
        <Box position="relative" w="full" h="full">
          <Skeleton isLoaded={!isBannerLoading}>
            <Image
              src={
                hasBanner
                  ? parseURI(collection?.config?.banner ?? '')
                  : parseURI(collection?.config?.avatar ?? '')
              }
              alt={collection?.name ?? ''}
              objectFit="cover"
              objectPosition="center"
              w="full"
              h="full"
              position="absolute"
              top={0}
              left={0}
              zIndex={1}
              cursor="pointer"
              onLoad={() => setIsBannerLoading(false)}
              onError={(e) => {
                e.currentTarget.src = nftEmpty;
                setIsBannerLoading(false);
              }}
            />
          </Skeleton>
          <Flex
            position="relative"
            zIndex={3}
            h="full"
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
