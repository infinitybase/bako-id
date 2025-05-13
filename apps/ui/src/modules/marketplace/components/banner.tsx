import Banner from '@/assets/marketplace-banner.png';
import { useChainId } from '@/hooks/useChainId';
import BakoIdService from '@/services/bako-id';
import { BakoIDQueryKeys } from '@/utils/constants';
import { Networks } from '@/utils/resolverNetwork';
import { Box, Button, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { useAccount } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ZeroBytes32 } from 'fuels';
import { isNil } from 'lodash';

export const MarketplaceBanner = () => {
  const { account } = useAccount();
  const { chainId } = useChainId();

  const { data, isLoading } = useQuery({
    queryKey: [BakoIDQueryKeys.NAME, account ?? ZeroBytes32, chainId],
    queryFn: async () => {
      return BakoIdService.name(account!, chainId ?? Networks.MAINNET);
    },
    enabled: !!account && !isNil(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  console.log('data', data);

  const handle = data || account;

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
            as={Link}
            to={`/profile/${handle}`}
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
