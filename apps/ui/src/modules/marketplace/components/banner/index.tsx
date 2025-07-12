import { useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';
import { parseURI } from '@/utils/formatter';

import { HexagonFillIcon } from '@/components/icons/hexagonFill';
import { HexagonEmptyIcon } from '@/components/icons/hexagonEmpty';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { StatBox } from './statBox';
import type { Collection } from '@/types/marketplace';

type MarketplaceBannerProps = {
  collections: Collection[];
};

export const MarketplaceBanner = ({ collections }: MarketplaceBannerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleRedirect = () => {
    router.navigate({
      to: '/marketplace/collection/$collectionId',
      params: { collectionId: collections[activeIndex].id },
    });
  };

  const router = useRouter();

  return (
    <Stack gap={4}>
      <Box
        position="relative"
        height="250px"
        borderRadius="8px"
        overflow="hidden"
      >
        <Swiper
          direction="vertical"
          slidesPerView={1}
          mousewheel
          modules={[Pagination, Mousewheel, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          style={{
            height: '100%',
            borderRadius: '8px',
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {collections.map((collection) => (
            <SwiperSlide key={collection.name}>
              <Box
                position="relative"
                w="full"
                h="full"
                cursor="pointer"
                onClick={handleRedirect}
              >
                <Image
                  src={parseURI(collection.config.banner)}
                  alt={collection.name}
                  objectFit="cover"
                  objectPosition="center"
                  w="full"
                  h="full"
                  position="absolute"
                  top={0}
                  left={0}
                  zIndex={1}
                />
                <Flex
                  position="relative"
                  zIndex={3}
                  h="full"
                  align="center"
                  px={4}
                  justify="space-between"
                  alignItems="flex-end"
                  bgGradient="linear(0deg, rgba(21,20,19,0.85) 0%, rgba(21,20,19,0.00) 100%)"
                >
                  <Box color="#fff" maxW="lg" mt="auto" mb={4}>
                    <VStack align="flex-start" mb={2}>
                      <Heading fontSize="md" fontWeight={600}>
                        {collection.name}
                      </Heading>
                      <Text color="text.700" fontSize="xs" fontWeight={400}>
                        {/* TODO: add author */}
                        By someone
                      </Text>
                    </VStack>
                    <Flex gap={3}>
                      <StatBox label="Sales" value={collection.metrics.sales} />
                      <StatBox
                        label="Floor price"
                        value={`${collection.metrics.floorPrice.toFixed(2)} ETH`}
                      />
                      <StatBox
                        label="Volume"
                        value={`${collection.metrics.volume.toFixed(2)} ETH`}
                      />
                    </Flex>
                  </Box>
                  <Button
                    rightIcon={<ArrowForwardIcon />}
                    color="#222"
                    bg="#fff"
                    borderRadius="8px"
                    fontWeight={500}
                    fontSize="16px"
                    px={6}
                    py={2}
                    _hover={{ bg: 'gray.100' }}
                    zIndex={3}
                    mb={4}
                  >
                    Explore collection
                  </Button>
                </Flex>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Flex
        className="custom-swiper-pagination"
        gap={2}
        justifyContent="center"
      >
        {collections.map((col, idx) =>
          idx === activeIndex ? (
            <HexagonFillIcon key={col.name} boxSize={3.5} />
          ) : (
            <HexagonEmptyIcon
              key={col.name}
              boxSize={3}
              cursor="pointer"
              onClick={() => swiperRef.current?.slideTo(idx)}
            />
          )
        )}
      </Flex>
    </Stack>
  );
};
