import { Button, Image } from '@chakra-ui/react';
import { useConnectUI } from '@fuels/react';
import link from '../../assets/link.svg'

export const Connect = () => {
  const { connect } = useConnectUI();
  const handleConnect = () => {
    connect()
  }

  return <Button
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
      <Image src={link} alt="link" width={4} height={4} fill="button.500" />
      Connect wallet
    </Button>
}
