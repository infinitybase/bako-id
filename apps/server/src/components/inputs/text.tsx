'use client';

import {
  Box,
  type BoxProps,
  Flex,
  HStack,
  useMediaQuery,
} from '@chakra-ui/react';

interface TextValueProps extends Omit<BoxProps, 'value'> {
  content?: string;
  leftAction?: string | React.ReactNode;
  leftColor?: string;
  rightAction?: string | React.ReactNode;
  breakRow?: boolean;
  darkBg?: boolean;
  additionalIcon?: React.ReactNode;
}

const TextValue = ({
  content,
  leftAction,
  leftColor,
  rightAction,
  breakRow,
  darkBg,
  additionalIcon,
  ...rest
}: TextValueProps) => {
  const [isMobile] = useMediaQuery('(max-width: 42em)');

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
      {...rest}
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
        isTruncated={!!isMobile}
      >
        {content}
      </Box>
      <HStack>
        <Box
          _hover={{
            cursor: 'pointer',
            color: 'button.500',
          }}
        >
          {rightAction}
        </Box>
        {additionalIcon && (
          <Box
            _hover={{
              cursor: 'pointer',
              color: 'button.500',
            }}
          >
            {additionalIcon}
          </Box>
        )}
      </HStack>
    </Flex>
  );
};

export { TextValue };
