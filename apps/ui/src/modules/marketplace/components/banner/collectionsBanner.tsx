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
import type { Swiper as SwiperType } from 'swiper';
import { BannerRoot } from './root';
import type { Collection } from '@/types/marketplace';

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
    <Flex flexDir="column" gap={2} h={{ base: '250px', sm: '350px' }} mt={0.5}>
      <Box
        position="relative"
        h="full"
        w={{ base: 'calc(100% - 23px)', sm: 'full' }}
        mx="auto"
      >
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
            <SwiperSlide key={collection.name} style={{ height: '250px' }}>
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
          display={{ base: 'none', sm: 'block' }}
        />
      </Box>
      <DotButtons
        banners={banners}
        activeIndex={activeIndex}
        swiperRef={swiperRef}
        display={{ base: 'block', sm: 'none' }}
      />
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
      position={{ base: 'unset', sm: 'absolute' }}
      mx={{ base: 'auto', sm: 'unset' }}
      right={0}
      top="50%"
      transform="translateY(-50%)"
      zIndex={5}
      onClick={(e) => e.stopPropagation()}
      w="40px"
      height="100px"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Box
        display="flex"
        flexDir={{ base: 'row', sm: 'column' }}
        gap={2}
        alignItems="center"
        justifyContent="center"
        w="full"
        mt={{ base: 6, sm: 0 }}
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
