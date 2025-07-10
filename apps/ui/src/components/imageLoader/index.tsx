import nftEmpty from '@/assets/nft-empty.png';
import { parseURI } from '@/utils/formatter';
import {
  Image,
  Skeleton,
  type ImageProps,
  type SkeletonProps,
} from '@chakra-ui/react';
import { useState } from 'react';

type ImageLoaderProps = {
  src: string;
  alt: string;
  props?: SkeletonProps;
  imageProps?: ImageProps;
};

export const ImageLoader = ({
  src,
  alt,
  props,
  imageProps,
}: ImageLoaderProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <Skeleton
      isLoaded={!isImageLoading}
      borderRadius="md"
      boxSize="42px"
      border="1px solid"
      borderColor="grey.600"
      backdropFilter={isImageLoading ? 'blur(24px)' : 'blur(0px)'}
      {...props}
    >
      <Image
        src={parseURI(src)}
        alt={alt}
        onLoad={() => setIsImageLoading(false)}
        onError={(e) => {
          e.currentTarget.src = nftEmpty;
          setIsImageLoading(false);
        }}
        {...imageProps}
      />
    </Skeleton>
  );
};
