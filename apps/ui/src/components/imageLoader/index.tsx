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
};

export const ImageLoader = ({
  src,
  alt,
  skeletonProps,
  imageProps,
  onClick,
}: ImageLoaderProps) => {
  const [isImageLoading, setIsImageLoading] = useState(() => {
    const img = new Image();
    img.src = src;
    return img.complete;
  });

  return (
    <Skeleton
      isLoaded={!isImageLoading}
      borderRadius="md"
      boxSize="42px"
      border="1px solid"
      borderColor="grey.600"
      backdropFilter={isImageLoading ? 'blur(24px)' : 'blur(0px)'}
      {...skeletonProps}
    >
      <ChakraImage
        src={parseURI(src)}
        alt={alt}
        onLoad={() => setIsImageLoading(false)}
        onError={(e) => {
          e.currentTarget.src = nftEmpty;
          setIsImageLoading(false);
        }}
        {...imageProps}
        onClick={onClick}
      />
    </Skeleton>
  );
};
