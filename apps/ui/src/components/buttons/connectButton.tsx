import { Box, Text } from '@chakra-ui/react';

import { ProgressButton } from './progressButton';

interface IConnectButtonProps {
  progress: number;
  isConnecting: boolean;
  connect: () => void;
}

export const ConnectButton = ({
  connect,
  progress,
  isConnecting,
}: IConnectButtonProps) => {
  return (
    <ProgressButton
      progress={progress}
      w="full"
      isDisabled={progress >= 1}
      background="button.500"
      color="background.500"
      fontSize={14}
      _hover={{ bgColor: 'button.600' }}
      progressColor="white"
      gap={2}
      display="flex"
      onClick={connect}
      alignItems="center"
    >
      {!isConnecting ? (
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Text color="background.500">Connect Wallet</Text>
        </Box>
      ) : (
        <Text color="background.500">Connecting...</Text>
      )}
    </ProgressButton>
  );
};
