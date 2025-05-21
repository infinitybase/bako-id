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
      <Box position="absolute" top="50%" left={10} transform="translateY(-50%)">
        <Stack spacing={4}>
          <Box>
            <Heading>
              List. Sell.{' '}
              <Text as="span" color="#F5F5F54D">
                Repeat.
              </Text>
            </Heading>
            <Text color="grey.100">Trading NFTs has never been this easy.</Text>
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
      <Image src={Banner} boxSize="full" objectFit="cover" borderRadius="8px" />
    </Box>
  );
};
