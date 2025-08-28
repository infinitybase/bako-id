import { Button, Skeleton, Tooltip } from '@chakra-ui/react';

type AnimatedBuyButtonProps = {
  showDisplayBuyButton: boolean;
  displayBuyButton: boolean;
  notEnoughBalance: boolean;
  isConnected: boolean;
  ctaButtonVariant: 'primary' | 'mktPrimary';
  isMobile: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  buttonAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isOwner: boolean;
};
export const AnimatedCardButton = ({
  showDisplayBuyButton,
  displayBuyButton,
  notEnoughBalance,
  isConnected,
  ctaButtonVariant,
  isMobile,
  isLoading,
  isLoaded,
  buttonAction,
  isOwner,
}: AnimatedBuyButtonProps) => {
  return (
    <Skeleton
      isLoaded={isLoaded}
      borderRadius="md"
      display="flex"
      alignItems="center"
      transition="transform 0.25s ease, opacity 0.25s ease"
      bgColor="grey.600"
      w="93%"
      mx="auto"
      boxShadow="0 0 10px 4px rgba(39, 39, 39, 0.84)"
      position={isMobile ? 'relative' : 'absolute'}
      mb={isMobile ? 2 : 0}
      bottom={isMobile ? 0 : 2}
      left={0}
      right={0}
      zIndex={10}
      opacity={isMobile ? 1 : showDisplayBuyButton ? 1 : 0}
      transform={
        isMobile
          ? 'translateY(0)'
          : showDisplayBuyButton
            ? 'translateY(0)'
            : 'translateY(12px)'
      }
      pointerEvents={isMobile ? 'auto' : displayBuyButton ? 'auto' : 'none'}
    >
      <Tooltip
        label={
          notEnoughBalance && isConnected && !isOwner
            ? 'Not enough balance'
            : ''
        }
      >
        <Button
          w="full"
          variant={isOwner ? 'tertiary' : ctaButtonVariant}
          _hover={{
            opacity: 0.7,
          }}
          h={isMobile ? '32px' : '24px'}
          py={1.5}
          isLoading={isLoading}
          disabled={
            !isOwner && ((notEnoughBalance && isConnected) || isLoading)
          }
          onClick={(e) => {
            e.stopPropagation();
            buttonAction(e);
          }}
        >
          {isOwner ? 'Delist NFT' : 'Buy Now'}
        </Button>
      </Tooltip>
    </Skeleton>
  );
};
