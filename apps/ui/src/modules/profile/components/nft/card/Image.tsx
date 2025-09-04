import { ImageLoader } from '@/components/imageLoader';
import { Box, type ImageProps } from '@chakra-ui/react';

export const Image = ({ boxSize = { xl: '160px ' }, ...props }: ImageProps) => {
  const { src, alt, ...rest } = props;

  return (
    <Box borderTopRadius="lg">
      <ImageLoader
        src={src!}
        alt={alt!}
        skeletonProps={{ boxSize, ...rest }}
        imageProps={{ boxSize, ...rest }}
      />
    </Box>
  );
};
