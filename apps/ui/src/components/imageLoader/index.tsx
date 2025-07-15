import nftEmpty from '@/assets/nft-empty.png';
import { parseURI } from '@/utils/formatter';
import {
  Image as ChakraImage,
  Skeleton,
  type ImageProps,
  type SkeletonProps,
} from '@chakra-ui/react';
import { useState } from 'react';

type ImageLoaderProps = {
  src: string;
  alt: string;
  skeletonProps?: SkeletonProps;
  imageProps?: ImageProps;
  onClick?: () => void;
  fallbackSrc?: string;
};

export const ImageLoader = ({
  src,
  alt,
  skeletonProps,
  imageProps,
  onClick,
  fallbackSrc = nftEmpty,
}: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(() => {
    const img = new Image();
    img.src = src;
    return img.complete;
  });

  return (
    <Skeleton
      isLoaded={!isLoading}
      borderRadius="md"
      boxSize="42px"
      border="1px solid"
      borderColor="grey.600"
      backdropFilter={isLoading ? 'blur(24px)' : 'blur(0px)'}
      {...skeletonProps}
    >
      <ChakraImage
        src={parseURI(src)}
        alt={alt}
        objectFit="cover"
        borderRadius="md"
        fallback={
          <ChakraImage
            src={fallbackSrc}
            alt={alt}
            objectFit="cover"
            borderRadius="md"
            {...imageProps}
          />
        }
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        {...imageProps}
        onClick={onClick}
      />
    </Skeleton>
  );
};
