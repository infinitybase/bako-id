import { useToken } from '@/hooks/useToken';
import type { ImageProps } from '@chakra-ui/react';
import { TokenImage } from './tokenImage';

interface CheckoutCardProps extends ImageProps {
  spinnerSize?: string;
}

export function CheckoutCard(props: CheckoutCardProps) {
  const { token } = useToken();

  return (
    <>
      <TokenImage src={token?.image} {...props} />
    </>
  );
}
