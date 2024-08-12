import { Image as ChakraImage, type ImageProps } from '@chakra-ui/react';
import { useEffect } from 'react';

interface TokenImageProps extends ImageProps {
  src: string;
}

export const TokenImage = ({ src, ...props }: TokenImageProps) => {
  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }, [src]);

  return (
    <ChakraImage
      src={src}
      w={['17rem', '50%', '50%', '55%']}
      h="fit"
      {...props}
    />
  );
};
