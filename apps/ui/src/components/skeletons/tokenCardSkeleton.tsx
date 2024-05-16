import {
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { Card } from '..';

export const TokenCardSkeleton = () => {
  return (
    <Card
      backdropFilter="blur(7px)"
      h="fit-content"
      maxW={['full', '45rem']}
      w={['full', 'auto', 'auto', '45rem']}
    >
      <CardHeader w="full">
        <Flex w="full" justify="space-between" align="center">
          <Heading fontSize="lg" color="grey.100">
            Token
          </Heading>
          <Skeleton w={30} h={10} rounded="lg" />
        </Flex>
      </CardHeader>
      <Divider color="stroke.500" border="1px solid" w="full" my={8} />
      <CardBody>
        <Flex
          direction={['column', 'row', 'row', 'row']}
          alignItems="center"
          h="fit-content"
          justifyContent="flex-end"
          gap={4}
          w="full"
        >
          <Flex w={['full', '80%']} direction="column" gap={6}>
            <Skeleton w="full" h={16} rounded="lg" />
            <Skeleton w="full" h={16} rounded="lg" />
          </Flex>

          <Skeleton
            w={['fit-content', '40', '40', '40']}
            h={['fit-content', '40', '40', '40']}
          />
        </Flex>
        <Divider color="stroke.500" border="1px solid" w="full" my={[3, 8]} />
        <Flex w="full" justify="center" direction={['column', 'row']} gap={4}>
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="31%" h={10} rounded="lg" />
        </Flex>
      </CardBody>
    </Card>
  );
};
