import {
  Button,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { Card, TextValue } from '..';

export const ValidityCardSkeleton = () => {
  return (
    <Card backdropFilter="blur(7px)" h="fit-content" maxW={['full', '45rem']}>
      <CardHeader w="full">
        <Flex w="full" justify="space-between" align="center">
          <Heading fontSize="lg" color="grey.100">
            Validity
          </Heading>
          <Button
            variant="ghosted"
            color="grey.100"
            hidden
            _hover={{
              bgColor: 'transparent',
              color: 'button.500',
            }}
            onClick={() => {}}
          >
            Extend
          </Button>
        </Flex>
      </CardHeader>
      <CardBody mt={4}>
        <FormControl>
          <Skeleton w="13%">
            <FormHelperText my={4} color="section.500">
              Name expires
            </FormHelperText>
          </Skeleton>
          <Skeleton>
            <TextValue
              leftAction={'march 31, 2024'}
              leftColor="grey.100"
              color="section.500"
              justifyContent="start"
              content="18:48:23 GMT +1"
            />
          </Skeleton>
        </FormControl>
        <FormControl my={4}>
          <FormHelperText
            display="flex"
            flexDirection="row"
            w="full"
            justifyContent="space-between"
            color="section.500"
            my={4}
          >
            <Skeleton>
              <Text>Grace period ends</Text>
            </Skeleton>
            <SkeletonCircle w={4} h={4} mr={2} />
          </FormHelperText>
          <Skeleton>
            <TextValue />
          </Skeleton>
        </FormControl>
        <FormControl>
          <FormHelperText my={4} color="section.500">
            <Skeleton w="12%">Registered</Skeleton>
          </FormHelperText>
          <Skeleton>
            <TextValue />
          </Skeleton>
        </FormControl>
      </CardBody>
    </Card>
  );
};
