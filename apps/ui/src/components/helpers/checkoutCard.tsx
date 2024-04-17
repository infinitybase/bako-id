import { Box, type BoxProps, Image, Text, VStack } from '@chakra-ui/react';
import symbol from '../../assets/logo.svg';
import texture from '../../assets/texture.svg';

interface CardProps extends BoxProps {
  domain: string;
}

export function CheckoutCard({ domain, ...props }: CardProps) {
  return (
    <Box
      border="3px solid #FFC010"
      borderRadius="lg"
      aspectRatio={1}
      w={['70%', '50%', '40%', '40%']}
      p={7}
      justifyContent="center"
      alignItems="center"
      display="flex"
      backgroundImage={`url(${texture})`}
      backgroundRepeat="repeat"
      {...props}
    >
      <VStack
        alignItems="center"
        color="white"
        height="full"
        width="full"
        justifyContent="center"
      >
        <Image src={symbol} w="10rem" height="10rem" />
        <Text fontSize="md" fontWeight="semibold">
          @{domain}
        </Text>
      </VStack>
    </Box>
  );
}
