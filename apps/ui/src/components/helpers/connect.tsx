import { Button, Center } from '@chakra-ui/react';
import { useConnectUI } from '@fuels/react';

export const Connect = () => {
  const { connect } = useConnectUI();

  return <Center w="full" h="100vh" bgColor="#0b0c0c">
    <Button onClick={() => connect()}>
      Connect fuel wallet
    </Button>
  </Center>
}
