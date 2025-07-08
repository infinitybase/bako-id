import EmptyImg from '@/assets/nft-empty.png';
import {
  Box,
  Image as ChakraImage,
  Skeleton,
  type ImageProps,
} from '@chakra-ui/react';
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
      <Skeleton isLoaded={!isLoading} rounded="lg">
        <ChakraImage
          alt={alt}
          onLoad={handleOnLoad}
          fallbackSrc={EmptyImg}
          onError={handleOnError}
          borderRadius="lg"
          aspectRatio="1/1"
          {...rest}
          src={isError ? EmptyImg : src}
        />
      </Skeleton>
    </Box>
  );
};
