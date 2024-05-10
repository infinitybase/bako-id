import {
  Box,
  Center,
  Divider,
  Flex,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Handle } from '../../../types';
import { HandleCard } from './handleCard';

interface IMyHandlesCardMobile {
  handles?: Handle[];
}

export const MyHandlesCardMobile = ({ handles }: IMyHandlesCardMobile) => {
  return (
    <Center w="full" h="max-content" p={4}>
      <VStack w="full" align="flex-start">
        <Flex w="full" justifyContent="flex-start" flexDir="column" gap={2}>
          <Text fontSize="md" fontWeight="semibold">
            My Handles
          </Text>
          <Divider borderColor="stroke.500" />
        </Flex>

        <Box
          w="full"
          maxH="90vh"
          overflowY="scroll"
          overflowX="hidden"
          sx={{
            '&::-webkit-scrollbar': {
              width: '0px',
              maxHeight: '300px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
            },
          }}
        >
          {handles ? (
            handles.map((handle) => (
              <HandleCard
                handle={handle}
                mx={0}
                _hover={{}}
                css={{
                  '&:last-child': {
                    marginBottom: '4rem',
                  },
                }}
              />
            ))
          ) : (
            <VStack spacing={3} my={2}>
              {[...Array(12)].map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Skeleton key={index} h="3rem" w="full" rounded="lg" />
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Center>
  );
};
