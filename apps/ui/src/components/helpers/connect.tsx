import { Box, Button, Image } from '@chakra-ui/react';
import { useConnectUI, useIsConnected } from '@fuels/react';

export const Connect = () => {
  const { connect } = useConnectUI();
  const { isConnected} = useIsConnected();

  const handleConnect = () => {
    if(isConnected) return
    connect()
  }

  return <Box>
    <Button
      onClick={handleConnect}
      w="full"
      display="flex"
      gap={2}
      bgColor={{ base: 'transparent', md: 'button.500' }}
      fontSize="sm"
      color={{ base: 'button.500', md: 'background.500' }}
      mt={4}
      _hover={{ bgColor: 'button.600' }}
      className="transition-all-05"
    >
      { isConnected ? (
        'Connected'
      ) : (
        <>
          <Image src="/link.svg" alt="link" width={4} height={4} fill="button.500" />
          Connect wallet
        </>
      )}
    </Button>
  </Box>
}
