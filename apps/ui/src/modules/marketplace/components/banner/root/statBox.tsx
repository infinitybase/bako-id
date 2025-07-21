import { Flex, Text } from '@chakra-ui/react';

const StatBox = ({
  label,
  value,
}: { label: string; value: string | number }) => {
  return (
    <Flex
      p="12px"
      borderRadius="8px"
      border="1px solid #F5F5F540"
      h="55px"
      textAlign="center"
      boxShadow="0 6px 12px 0 #00000040"
      backdropFilter="blur(24px)"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="xs" color="gray.100" mb={1}>
        {label}
      </Text>
      <Text fontWeight={600} fontSize="sm" color="text.700">
        {value}
      </Text>
    </Flex>
  );
};

export { StatBox };
