import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { Autoplay, Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { HexagonEmptyIcon } from '@/components/icons/hexagonEmpty';
import { HexagonFillIcon } from '@/components/icons/hexagonFill';
import { useListMintableCollections } from '@/hooks/marketplace/useListMintableCollections';
import type { Swiper as SwiperType } from 'swiper';
import { BannerRoot } from './root';

export const MarketplaceBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

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

  if (isLoading) {
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
        right={0}
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
