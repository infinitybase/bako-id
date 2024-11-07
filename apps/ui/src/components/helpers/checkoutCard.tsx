import { Spinner, type ImageProps } from '@chakra-ui/react';
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
        <Spinner boxSize="100px" mx="auto" />
      )}
    </>
  );
}
