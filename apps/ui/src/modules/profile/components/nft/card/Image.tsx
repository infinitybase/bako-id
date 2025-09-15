import { ImageLoader } from '@/components/imageLoader';
import type { ImageProps } from '@chakra-ui/react';

export const Image = ({ boxSize = { xl: '160px ' }, ...props }: ImageProps) => {
  const { src, alt, ...rest } = props;

  console.log('src', src);

  return (
    <ImageLoader
      src={src!}
      alt={alt!}
      skeletonProps={{ boxSize, ...rest }}
      imageProps={{
        boxSize,
        ...rest,
        borderTopRadius: '8px',
        borderBottomRadius: '0',
        aspectRatio: '1/1',
      }}
    />
  );
};
