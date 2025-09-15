import nftEmpty from '@/assets/nft-empty.png';
import { parseURI } from '@/utils/formatter';
import {
  Image as ChakraImage,
  Skeleton,
  type ImageProps,
  type SkeletonProps,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  // Check if image is already cached by the browser on mount
  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
    img.src = src;

    // If image is already cached, it will load immediately
    if (img.complete) {
      setIsLoading(false);
    }
  }, [src]);

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
