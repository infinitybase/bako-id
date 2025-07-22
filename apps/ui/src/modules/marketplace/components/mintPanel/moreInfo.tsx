import {
  Box,
  type BoxProps,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';

type MoreInfoProps = {
  title: string;
  description: string;
  reverse?: boolean;
} & BoxProps;

const MoreInfo = (props: MoreInfoProps) => {
  const { title, description, reverse, ...rest } = props;

  const reverseDirection = reverse ? 'row' : 'row-reverse';
  const reverseImage = reverse ? 'left' : 'right';

  return (
    <Flex
      {...rest}
      w="full"
      gap="123px"
      align="center"
      py="72px"
      flexDir={reverseDirection}
      pr={reverse ? '0' : '50px'}
      pl={reverse ? '50px' : '0'}
    >
      <Flex
        flexDir="column"
        gap={4}
        justify="center"
        flex={1}
        order={reverseImage === 'left' ? 1 : 2}
      >
        <Heading color="white" fontSize="sm">
          {title}
        </Heading>
        <Text fontSize="xs" color="section.500">
          {description}
        </Text>
      </Flex>
      <Box maxW="480px" h="270px" flex={1}>
        <Image
          src="https://i.imgur.com/1Q9Z1Zm.png'"
          alt="More Info"
          boxSize="full"
        />
      </Box>
    </Flex>
  );
};

export default MoreInfo;
