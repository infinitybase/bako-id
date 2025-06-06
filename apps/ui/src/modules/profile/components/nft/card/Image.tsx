import EmptyImg from '@/assets/nft-empty.png';
import {
  Box,
  Image as ChakraImg,
  Skeleton,
  type ImageProps,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

export const Image = ({ ...props }: ImageProps) => {
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
      h={{
        lg: '150px',
      }}
      overflow="hidden"
      mx="auto"
      borderTopRadius="lg"
    >
      <Skeleton isLoaded={!isLoading}>
        <ChakraImg
          onLoad={handleOnLoad}
          fallbackSrc={EmptyImg}
          onError={handleOnError}
          borderTopRadius="8px"
          aspectRatio="1/1"
          {...props}
          src={isError ? EmptyImg : props.src}
        />
      </Skeleton>
    </Box>
  );
};
