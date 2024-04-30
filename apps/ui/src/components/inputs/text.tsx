import { Box, Flex, InputGroup, type BoxProps } from '@chakra-ui/react';
import { useScreenSize } from '../../hooks/useScreenSize';

interface TextValueProps extends BoxProps {
  content?: string;
  leftAction?: string | React.ReactNode;
  rightAction?: string | React.ReactNode;
}

const TextValue = ({
  content,
  leftAction,
  rightAction,
  ...rest
}: TextValueProps) => {
  const { isMobile } = useScreenSize();

  return (
    <Flex
      w="full"
      gap={4}
      justifyContent="space-between"
      alignItems="center"
      // Add all styles same used in input
    >
      <InputGroup w="full">
        {leftAction}
        <Box
          w="full"
          alignItems="center"
          justifyContent="end"
          display="flex"
          h={10}
          border="1px solid"
          borderColor="stroke.500"
          borderLeftColor={leftAction ? 'transparent' : 'stroke.500'}
          borderLeftRadius={leftAction ? 'initial' : 'lg'}
          borderRightColor={rightAction ? 'transparent' : 'stroke.500'}
          borderRightRadius={rightAction ? 'none' : 'lg'}
          backgroundColor="input.600"
          color={'grey.100'}
          fontSize={['xs', 'sm']}
          pl={leftAction ? 1 : 4}
          pr={rightAction ? 0 : 4}
          fontWeight={500}
          _focus={{
            borderColor: 'stroke.500',
            borderInlineColor: 'transparent',
          }}
          _hover={{}}
          whiteSpace={!isMobile ? 'pre-wrap' : 'nowrap'}
          wordBreak={!isMobile ? 'break-word' : 'normal'}
          isTruncated={isMobile ? true : false}
          {...rest}
        >
          {content}
        </Box>
        {rightAction}
      </InputGroup>
    </Flex>
  );
};

export { TextValue };
