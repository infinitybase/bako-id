import { Box, Button, Image } from '@chakra-ui/react';
import { useConnectUI } from '@fuels/react';

export const Connect = () => {
  const { connect } = useConnectUI();

  return <Box>
    <Button
      onClick={() => connect()}
      w="full"
      display="flex"
      gap={2}
      bgColor="button.500"
      fontSize="sm"
      color="background.500"
      mt={4}
      _hover={{ bgColor: 'button.600' }}
      className="transition-all-05"
    >
      <Image src="/link.svg" alt="link" width={4} height={4} />
      Connect wallet
    </Button>
  </Box>
}
