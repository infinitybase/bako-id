import { Flex, type FlexProps } from '@chakra-ui/react';

export interface ContentProps extends FlexProps {}

const Content = (props: ContentProps) => {
  const { children, ...rest } = props;
  return (
    <Flex
      mt={0}
      overflowY="scroll"
      css={{ '&::-webkit-scrollbar': { width: '0' }, scrollbarWidth: 'none' }}
      minH="calc(100vh - 97px)"
      flex={1}
      py={{
        base: 3,
        sm: 6,
      }}
      px={{
        base: 5,
        sm: 6,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export { Content };
