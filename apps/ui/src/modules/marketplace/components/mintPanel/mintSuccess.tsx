import { NftModal } from '@/modules/profile/components/nft/modal';
import { Flex, Button, Image, Box } from '@chakra-ui/react';
import { useScreenSize } from '@/hooks';
import { Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import NftMinted from '@/assets/marketplace/nft-minted.svg';
import { CloseIcon } from '@/components/icons/closeIcon';
import { Icon } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { NavigationLeftIcon } from '../icons/navigationLeftIcon';
import { NavigationRightIcon } from '../icons/navigationRightArrow';
import { useState, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { parseURI } from '@/utils/formatter';
import { ImageLoader } from '@/components/imageLoader';
import { NftCard } from '@/modules/profile/components/nft/card';
import { getExplorer } from '@/utils/getExplorer';
import { useChainId } from '@/hooks/useChainId';
import { ShareMenu } from '../banner/root/shareMenu';
import { slugify } from '@/utils/slugify';

type MintSuccessProps = {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  mints: { name: string; image: string; id: string }[];
  collectionName: string;
};

export default function MintSuccess({
  isOpen,
  onClose,
  transactionId,
  mints,
  collectionName,
}: MintSuccessProps) {
  const { isMobile } = useScreenSize();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const { chainId } = useChainId();
  const explorerUrl = getExplorer(chainId);
  const slugifiedCollectionName = slugify(collectionName);

  const contentWidth =
    mints.length === 1 || isMobile
      ? '430px'
      : mints.length === 2
        ? '836px'
        : '1085px';
  const slidesPerView =
    mints.length === 1 || isMobile ? 1 : mints.length === 2 ? 2 : 2.6;
  const getEdition = (name: string) => {
    const edition = name?.split('#')[1];
    return edition ? `#${edition}` : '';
  };

  return (
    <NftModal.Root isOpen={isOpen} onClose={onClose} size={{ base: 'full' }}>
      <NftModal.Content
        maxW={contentWidth}
        minH={{ base: 'full', sm: '615px' }}
        borderRadius="8px"
        overflow="hidden"
        justifyContent="center"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Image
            src={NftMinted}
            alt="minted-nft"
            w="430px"
            mx="auto"
            objectFit="contain"
            objectPosition="center"
            maxH="116px"
          />
          <Icon as={CloseIcon} cursor="pointer" onClick={onClose} mb="auto" />
        </Flex>

        <Box position="relative">
          <Swiper
            direction="horizontal"
            slidesPerView={slidesPerView}
            modules={[Pagination, Navigation]}
            spaceBetween={22}
            style={{
              height: '100%',
              width: '100%',
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            onSwiper={setSwiper}
          >
            {mints?.map((mint) => {
              const edition = getEdition(mint.name);
              return (
                <SwiperSlide
                  key={mint.name}
                  style={{
                    width: 'full',
                    maxWidth: '382px',
                    position: 'relative',
                  }}
                >
                  {edition && (
                    <NftCard.EditionBadge edition={edition} zIndex={10} />
                  )}
                  <Flex
                    flexDir="column"
                    gap={4}
                    w={{ base: 'full', md: '361px', lg: '382px' }}
                  >
                    <ImageLoader
                      src={parseURI(mint.image)}
                      alt={mint.name}
                      imageProps={{
                        borderRadius: '8px',
                        boxSize: { base: '100%', md: '361px', lg: '382px' },
                      }}
                      skeletonProps={{
                        borderRadius: '8px',
                        boxSize: { base: '100%', md: '363px', lg: '384px' },
                      }}
                    />

                    <Flex gap={2}>
                      <Button
                        w="full"
                        variant="secondary"
                        _hover={{
                          borderColor: 'garage.100',
                          color: 'garage.100',
                        }}
                        borderColor="section.500"
                        fontWeight={400}
                        letterSpacing="1px"
                        onClick={() =>
                          window.open(
                            `${explorerUrl}/tx/${transactionId}`,
                            '_blank'
                          )
                        }
                      >
                        View on explorer
                      </Button>

                      <ShareMenu
                        collectionIdOrSlug={slugifiedCollectionName}
                        collectionName={collectionName}
                        onlyShareOnX
                        twitterTitle={`Just minted my ${collectionName} on @garagedotzone`}
                      />
                    </Flex>
                  </Flex>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <CustomNavigation
            swiper={swiper}
            showGradient={!isMobile && mints.length > 2}
          />
        </Box>
      </NftModal.Content>
    </NftModal.Root>
  );
}

const CustomNavigation = ({
  swiper,
  showGradient,
}: { swiper: SwiperType | null; showGradient: boolean }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiper) {
      const updateNavigationState = () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      };

      updateNavigationState();
      swiper.on('slideChange', updateNavigationState);
      swiper.on('reachBeginning', updateNavigationState);
      swiper.on('reachEnd', updateNavigationState);

      return () => {
        swiper.off('slideChange', updateNavigationState);
        swiper.off('reachBeginning', updateNavigationState);
        swiper.off('reachEnd', updateNavigationState);
      };
    }
  }, [swiper]);

  const gradientPosition = swiper?.isBeginning ? 'right' : 'left';

  return (
    <>
      {showGradient && (
        <Box
          bg={`linear-gradient(to ${gradientPosition === 'left' ? 'right' : 'left'}, rgba(20, 20, 20, 0.8), transparent)`}
          position="absolute"
          left={gradientPosition === 'left' ? 0 : 'auto'}
          right={gradientPosition === 'right' ? 0 : 'auto'}
          top={0}
          bottom={0}
          h="105%"
          w="80px"
          zIndex={4}
        />
      )}
      <Box
        className="swiper-button-prev-custom"
        position="absolute"
        left={-2}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        cursor={!isBeginning ? 'pointer' : 'default'}
        opacity={!isBeginning ? 1 : 0}
        pointerEvents={!isBeginning ? 'auto' : 'none'}
      >
        <NavigationLeftIcon color="white" />
      </Box>

      <Box
        className="swiper-button-next-custom"
        position="absolute"
        right={-2}
        top="50%"
        transform="translateY(-50%)"
        zIndex={15}
        cursor={!isEnd ? 'pointer' : 'default'}
        opacity={!isEnd ? 1 : 0}
        pointerEvents={!isEnd ? 'auto' : 'none'}
        color="white"
      >
        <NavigationRightIcon color="white" />
      </Box>
    </>
  );
};
