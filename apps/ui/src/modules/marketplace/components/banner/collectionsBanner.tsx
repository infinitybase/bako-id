import { useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Box, Flex, Skeleton, useMediaQuery } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';
import { BannerRoot } from './root';
import { HexagonFillIcon } from '@/components/icons/hexagonFill';
import { HexagonEmptyIcon } from '@/components/icons/hexagonEmpty';
import { useListMintableCollections } from '@/hooks/marketplace/useListMintableCollections';

export const MarketplaceBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isLargerThan1920] = useMediaQuery('(min-width: 1920px)');
  const [isLargerThan2090] = useMediaQuery('(min-width: 2090px)');
  const [isLargerThan2225] = useMediaQuery('(min-width: 2225px)');

  const { collections: banners, isLoading } = useListMintableCollections({
    limit: 3,
  });

  const handleRedirect = () => {
    if (!banners) return;
    router.navigate({
      to: '/collection/$collectionId',
      params: { collectionId: banners[activeIndex].id },
    });
  };

  const router = useRouter();

  if (!banners || isLoading) {
    return <Skeleton height="350px" />;
  }

  return (
    <Box position="relative" height="350px" overflow="hidden">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        mousewheel
        modules={[Pagination, Mousewheel, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        style={{
          height: '100%',
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {banners?.map((collection) => (
          <SwiperSlide key={collection.name}>
            <BannerRoot.CollectionsContent
              collection={collection}
              handleRedirect={handleRedirect}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Flex
        direction="column"
        gap={2}
        position="absolute"
        right={
          isLargerThan2225
            ? '14%'
            : isLargerThan2090
              ? '8%'
              : isLargerThan1920
                ? '4%'
                : '0'
        }
        top="50%"
        transform="translateY(-50%)"
        zIndex={5}
        onClick={(e) => e.stopPropagation()}
        w="40px"
        height="100px"
        alignItems="center"
        justifyContent="center"
      >
        {banners?.map((col, idx) =>
          idx === activeIndex ? (
            <HexagonFillIcon
              key={col.name}
              boxSize={3.5}
              cursor="pointer"
              onClick={() => swiperRef.current?.slideTo(idx)}
            />
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
    </Box>
  );
};
