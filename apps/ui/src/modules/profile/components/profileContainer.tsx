import { Flex, Stack } from '@chakra-ui/react';

export default function ProfileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      w="full"
      justifyContent="center"
      pr={['0', '0', '0', '0', '0', '10%']}
    >
      <Stack
        display="flex"
        flexDirection="column"
        gap={6}
        w="full"
        maxW={1080}
        h="full"
        maxH="100vh"
        mx="auto"
      >
        {children}
      </Stack>
    </Flex>
  );
}
