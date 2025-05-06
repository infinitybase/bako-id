import EmptyImg from '@/assets/nft-empty.png';
import {
  type ImageProps,
  Box,
  Image as ChakraImg,
  Skeleton,
} from '@chakra-ui/react';
import { useState } from 'react';

export const Image = ({ ...props }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleOnLoad = () => {
    setIsLoading(false);
  };

  return (
    <Box
      minH={{
        lg: '150px',
      }}
      mx="auto"
      borderRadius="lg"
    >
      <Skeleton isLoaded={!isLoading}>
        <ChakraImg
          onLoad={handleOnLoad}
          fallbackSrc={EmptyImg}
          borderTopRadius="4px"
          {...props}
        />
      </Skeleton>
    </Box>
  );
};
