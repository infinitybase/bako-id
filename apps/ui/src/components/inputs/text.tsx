import { Box, Flex, type BoxProps } from '@chakra-ui/react';
import { useScreenSize } from '../../hooks/useScreenSize';

interface TextValueProps extends BoxProps {
  content?: string;
  leftAction?: string | React.ReactNode;
  leftColor?: string;
  rightAction?: string | React.ReactNode;
  breakRow?: boolean;
  darkBg?: boolean;
}

const TextValue = ({
  content,
  leftAction,
  leftColor,
  rightAction,
  breakRow,
  darkBg,
  ...rest
}: TextValueProps) => {
  const { isMobile } = useScreenSize();

  return (
    <Flex
      w={'full'}
      gap={4}
      pl={leftAction ? 2 : 0}
      pr={rightAction ? 2 : 0}
      justifyContent="space-between"
      alignItems="center"
      fontSize={['xs', 'sm']}
      h={breakRow ? '16' : '10'}
      bgColor={darkBg ? 'background.900' : 'input.600'}
      border="1px solid"
      color="section.500"
      borderColor="stroke.500"
      rounded="lg"
      whiteSpace="nowrap"
      wordBreak="normal"
      // Add all styles same used in input
    >
      <Box w={breakRow ? '16' : 'fit-content'} color={leftColor}>
        {leftAction}
      </Box>
      <Box
        w="full"
        alignItems="center"
        justifyContent="end"
        display="flex"
        color={'grey.100'}
        fontSize={['xs', 'sm']}
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
      <Box
        _hover={{
          cursor: 'pointer',
          color: 'button.500',
        }}
      >
        {rightAction}
      </Box>
    </Flex>
  );
};

export { TextValue };
