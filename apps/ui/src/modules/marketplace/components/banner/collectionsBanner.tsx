import { useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Box, Flex } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';
import type { Collection } from '@/types/marketplace';
import { BannerRoot } from './root';
import { HexagonFillIcon } from '@/components/icons/hexagonFill';
import { HexagonEmptyIcon } from '@/components/icons/hexagonEmpty';

type MarketplaceBannerProps = {
  collections: Collection[];
};

export const MarketplaceBanner = ({ collections }: MarketplaceBannerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleRedirect = () => {
    router.navigate({
      to: '/collection/$collectionId',
      params: { collectionId: collections[activeIndex].id },
    });
  };

  const router = useRouter();

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
        {collections.map((collection) => (
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
        {collections.map((col, idx) =>
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
