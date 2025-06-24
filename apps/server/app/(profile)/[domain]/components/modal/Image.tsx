import EmptyImg from '@/assets/nft-empty.png';
import { Box, Skeleton } from '@chakra-ui/react';
import NextImage, { type ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

export const Image = ({ src, alt, ...rest }: ImageProps) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  const handleOnLoad = () => {
    setStatus('idle');
  };

  const handleOnError = () => {
    setStatus('error');
  };

  const isLoading = useMemo(() => status === 'loading', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  return (
    <Box
      boxSize={{
        base: 'full',
        sm: '330px',
        md: 'full',
      }}
      minH={{
        lg: '480px',
      }}
      mx="auto"
      borderRadius="lg"
    >
      <Skeleton isLoaded={!isLoading} position="relative" aspectRatio="1/1">
        <NextImage
          alt={alt}
          onLoad={handleOnLoad}
          onError={handleOnError}
          style={{ borderRadius: '8px' }}
          {...rest}
          src={isError ? EmptyImg.src : src!}
          fill
        />
      </Skeleton>
    </Box>
  );
};
