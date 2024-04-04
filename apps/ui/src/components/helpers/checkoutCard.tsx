import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react';
import symbol from '../../assets/logo.svg';
import logo from '../../assets/footer-logo.svg';
import texture from '../../assets/texture.svg';

interface CardProps {
  domain: string;
}

export function CheckoutCard({ domain }: CardProps) {
  return (
    <Box
      border="4px solid #FFC010"
      borderRadius="4px"
      aspectRatio={1}
      minW="220px"
      padding="1rem"
      position="relative"
      backgroundImage={`url(${texture})`}
      backgroundRepeat="repeat"
    >
      <Image
        src={symbol}
        w="90px"
        height="90px"
        position="absolute"
        top="0"
        left="0"
      />
      <VStack
        alignItems="start"
        color="white"
        height="100%"
        width="100%"
        justifyContent="flex-end"
        fontSize="32px"
        fontWeight={600}
      >
        <Text fontSize={'xxl'}>
          <span
            style={{
              color: '#fdc940',
            }}
          >
            @
          </span>
          {domain}
        </Text>
        <Flex alignItems="center" gap={1}>
          <Text fontSize="8px">Powered by</Text>
          <Image src={logo} />
        </Flex>
      </VStack>
    </Box>
  );
}
