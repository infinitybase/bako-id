import BannerMobile from '@/assets/marketplace-banner-mobile.png';
import Banner from '@/assets/marketplace-banner.png';
import { useResolverName } from '@/hooks';
import { Box, Button, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { useAccount, useConnectUI } from '@fuels/react';
import { useNavigate } from '@tanstack/react-router';
import { ZeroBytes32 } from 'fuels';

export const MarketplaceBanner = () => {
  const { account } = useAccount();
  const { connect } = useConnectUI();
  const navigate = useNavigate();

  const { data, isLoading } = useResolverName(account || ZeroBytes32);

  const handle = data || account;

  const handleStartSelling = () => {
    if (!handle) {
      connect();
      return;
    }
    navigate({
      to: `/profile/${handle}`,
    });
  };

  return (
    <Box height="230px" position="relative">
      <Box
        position="absolute"
        top="50%"
        left={{
          md: 10,
          base: 4,
        }}
        transform="translateY(-50%)"
      >
        <Stack
          spacing={{
            base: 10,
            sm: 4,
          }}
        >
          <Box>
            <Heading
              fontSize={{
                md: '3xl',
                base: '2xl',
              }}
            >
              List. Sell.{' '}
              <Text as="span" color="#F5F5F54D">
                Repeat.
              </Text>
            </Heading>
            <Text
              maxW={{
                base: '190px',
                md: 'none',
              }}
              color="grey.100"
            >
              Trading NFTs has never been this easy.
            </Text>
          </Box>

          <Button
            onClick={handleStartSelling}
            borderColor="grey.100"
            disabled={isLoading}
            color="grey.100"
            variant="outline"
            width="fit-content"
            _hover={{
              opacity: 0.7,
            }}
          >
            Start selling
          </Button>
        </Stack>
      </Box>
      <Image
        src={Banner}
        boxSize="full"
        objectFit="cover"
        borderRadius="8px"
        objectPosition={{
          sm: '80% 50%',
          base: '50% 50%',
          md: '50% 50%',
        }}
        display={{ base: 'none', sm: 'block' }}
      />
      <Image
        src={BannerMobile}
        display={{ base: 'block', sm: 'none' }}
        boxSize="full"
        objectFit="cover"
        borderRadius="8px"
      />
    </Box>
  );
};
