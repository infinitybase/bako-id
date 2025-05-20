import EmptyImg from '@/assets/nft-empty.png';
import {
  Box,
  Image as ChakraImage,
  Skeleton,
  type ImageProps,
} from '@chakra-ui/react';
import { useState } from 'react';

export const Image = ({ src, alt, ...rest }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleOnLoad = () => {
    setIsLoading(false);
  };

  return (
    <Box
      boxSize={{
        base: '330px',
        md: 'full',
      }}
      minH={{
        lg: '480px',
      }}
      mx="auto"
      borderRadius="lg"
    >
      <Skeleton isLoaded={!isLoading}>
        <ChakraImage
          src={src}
          alt={alt}
          onLoad={handleOnLoad}
          fallbackSrc={EmptyImg}
          borderRadius="lg"
          aspectRatio="1/1"
          {...rest}
        />
      </Skeleton>
    </Box>
  );
};
