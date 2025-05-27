import EmptyImg from '@/assets/nft-empty.png';
import {
  Image as ChakraImg,
  Skeleton,
  type ImageProps,
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
        aspectRatio="1/1"
        {...props}
      />
    </Skeleton>
  );
};
