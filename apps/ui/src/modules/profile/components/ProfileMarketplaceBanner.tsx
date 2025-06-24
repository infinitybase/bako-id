import MarketplaceBannerMobile from '@/assets/marketplace-banner-mobile.png';
import MarketplaceBanner from '@/assets/marketplace-banner.png';
import { Box, Heading, Image, Text } from '@chakra-ui/react';

export const ProfileMarketplaceBanner = () => {
  return (
    <Box maxH="150px" position="relative">
      <Image
        src={MarketplaceBanner}
        objectPosition="top"
        boxSize="full"
        borderRadius="md"
        objectFit="cover"
        display={{ base: 'none', sm: 'block' }}
      />

      <Image
        src={MarketplaceBannerMobile}
        objectPosition="top"
        boxSize="full"
        borderRadius="md"
        objectFit="cover"
        display={{ base: 'block', sm: 'none' }}
      />

      <Box
        position="absolute"
        top="50%"
        left={{ base: 2, sm: 10 }}
        transform="translateY(-50%)"
      >
        <Heading fontSize={{ md: '3xl', base: '2xl' }}>
          List. Sell.{' '}
          <Text as="span" color="#F5F5F54D">
            Repeat.
          </Text>
        </Heading>
        <Text maxW={{ base: '190px', md: 'none' }} color="grey.100">
          Trading NFTs has never been this easy.
        </Text>
      </Box>
    </Box>
  );
};
