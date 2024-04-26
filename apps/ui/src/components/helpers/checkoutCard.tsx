import { Box, Image, Text, VStack, type BoxProps } from '@chakra-ui/react';
import symbol from '../../assets/logo.svg';
import texture from '../../assets/texture.svg';

interface CardProps extends BoxProps {
  domain: string;
}

export function CheckoutCard({ domain, ...props }: CardProps) {
  return (
    <Box
      borderRadius="lg"
      aspectRatio={1}
      w={['17rem', '50%', '50%', '50%']}
      p={9}
      justifyContent="center"
      alignItems="center"
      display="flex"
      backgroundImage={`url(${texture})`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
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
