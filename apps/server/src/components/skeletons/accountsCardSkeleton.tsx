import { Flex, Skeleton, VStack } from '@chakra-ui/react';
import { Card } from '../card';

export const AccountsCardSkeleton = () => {
  return (
    <Card
      w={['full', 'full', 'full', '50%']}
      h={['fit-content', 'fit-content', 'fit-content', 'auto']}
      display="flex"
      backdropFilter="blur(6px)"
      flexDirection="column"
      gap={6}
    >
      <Flex alignItems="center" justify="space-between">
        <Skeleton w={32} h={8} rounded="md" />
        {/* {isMyDomain && (
        <Button variant="ghosted" rightIcon={<PlusSquareIcon />}>
          Add
        </Button>
      )} */}
      </Flex>

      <VStack spacing={5}>
        <Skeleton w="full" h={9} rounded="lg" />
        <Skeleton w="full" h={9} rounded="lg" />
      </VStack>
    </Card>
  );
};
