import { Image as ChakraImage, ImageProps, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface TokenImageProps extends ImageProps {
  src: string;
}

export const TokenImage = ({ src, ...props }: TokenImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoading(false);
      };
    }
  }, [src]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ChakraImage
      src={src}
      w={['17rem', '50%', '50%', '55%']}
      h="fit"
      {...props}
    />
  );
};
