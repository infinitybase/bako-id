import { Skeleton, type ImageProps } from '@chakra-ui/react';
import { useToken } from '../../hooks/useToken';
import { TokenImage } from './tokenImage';

interface CheckoutCardProps extends ImageProps {}

export function CheckoutCard(props: CheckoutCardProps) {
  const { token } = useToken();

  return (
    <>
      {token?.image ? (
        <TokenImage src={token.image} {...props} />
      ) : (
        <Skeleton w="40" h="40" {...props} />
      )}
    </>
  );
}
