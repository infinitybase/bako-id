import { Center, Divider, Text, VStack } from '@chakra-ui/react';

export const NotConnected = () => {
  return (
    <Center w="full" h="full" alignItems="center" zIndex={10}>
      <VStack textAlign={'center'} spacing={6}>
        <Text
          bgGradient="linear(to-br, #FFC010, #B24F18)"
          bgClip="text"
          fontWeight={700}
          fontSize={48}
          lineHeight={1}
          gap={2}
        >
          You're not connect to a wallet!
        </Text>

        <Text fontSize={15} color={'text.700'}>
          You must connect to a wallet so we can start to setup your domains!
        </Text>

        <Divider
          w="60%"
          h="1px"
          border="none"
          bgGradient="linear(to-r, #FFC010, #B24F18)"
        />
      </VStack>
    </Center>
  );
};
