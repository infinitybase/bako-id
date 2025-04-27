import EmptyImg from '@/assets/nft-empty.png';
import {
  type ImageProps,
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
    <Skeleton isLoaded={!isLoading}>
      <ChakraImg
        onLoad={handleOnLoad}
        fallbackSrc={EmptyImg.src}
        fallbackStrategy="onError"
        borderTopRadius="8px"
        {...props}
      />
    </Skeleton>
  );
};
