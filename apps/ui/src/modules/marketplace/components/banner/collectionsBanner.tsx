import { Box, type BoxProps, Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { Autoplay, Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { HexagonEmptyIcon } from '@/components/icons/hexagonEmpty';
import { HexagonFillIcon } from '@/components/icons/hexagonFill';
import { useListMintableCollections } from '@/hooks/marketplace/useListMintableCollections';
import type { Collection } from '@/types/marketplace';
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
      to: '/collection/$collectionName',
      params: { collectionName: banners[activeIndex].slug },
    });
  };

  const router = useRouter();

  if (isLoading) {
    return <Skeleton height="350px" />;
  }

  return (
    <Flex flexDir="column" gap={2} h={{ base: '250px', sm: '352px' }} mt={0.5}>
      <Box
        position="relative"
        h="full"
        w={{ base: 'calc(100% - 23px)', sm: 'full' }}
        mx="auto"
      >
        <Swiper
          direction="horizontal"
          slidesPerView={1}
          modules={[Pagination, Mousewheel, Autoplay]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          style={{
            height: '100%',
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {banners?.map((collection) => (
            <SwiperSlide key={collection.name} style={{ height: 'full' }}>
              <BannerRoot.CollectionsContent
                collection={collection}
                handleRedirect={handleRedirect}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <DotButtons
          banners={banners}
          activeIndex={activeIndex}
          swiperRef={swiperRef}
        />
      </Box>
    </Flex>
  );
};

const DotButtons = ({
  banners,
  activeIndex,
  swiperRef,
  ...props
}: {
  banners: Collection[] | undefined;
  activeIndex: number;
  swiperRef: React.RefObject<SwiperType | null>;
} & BoxProps) => {
  return (
    <Flex
      mx="auto"
      zIndex={5}
      onClick={(e) => e.stopPropagation()}
      w="40px"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Box
        display="flex"
        flexDir="row"
        gap={2}
        alignItems="center"
        justifyContent="center"
        w="full"
        mt={6}
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
      </Box>
    </Flex>
  );
};
