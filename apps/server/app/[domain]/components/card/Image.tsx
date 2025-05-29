import EmptyImg from '@/assets/nft-empty.png';
import { Skeleton } from '@chakra-ui/react';
import NextImage, { type ImageProps } from 'next/image';
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
    <Skeleton isLoaded={!isLoading} position="relative" aspectRatio="1/1">
      <NextImage
        onLoad={handleOnLoad}
        onError={handleOnError}
        style={{ borderTopRightRadius: '8px', borderTopLeftRadius: '8px' }}
        {...props}
        src={isError ? EmptyImg.src : props.src!}
        fill
      />
    </Skeleton>
  );
};
