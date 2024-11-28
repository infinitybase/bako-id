import { Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { MinimalAlertIcon } from '../icons/minimal-alert.tsx';

const AlertWarning = ({ message }: { message: string }) => {
  return (
    <VStack
      bg="#FFC01026"
      borderColor="#FFC0104D"
      borderWidth="1px"
      alignItems="start"
      justifyContent="center"
      borderRadius="8px"
      p="12px 8px"
    >
      <Flex gap="6px">
        <Icon color="warning.600" as={MinimalAlertIcon} />
        <Heading color="warning.600" fontWeight={600} fontSize="14px">
          Warning!
        </Heading>
      </Flex>
      <Text color="#EED07C" fontSize="xs" lineHeight="14.52px" ml={6}>
        {message}
      </Text>
    </VStack>
  );
};

export const Alert = {
  Warning: AlertWarning,
};
