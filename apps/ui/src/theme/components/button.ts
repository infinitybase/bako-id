import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  width: 'full',
  bgColor: 'button.500',
  color: 'input.900',
  _hover: {
    bgColor: 'button.600',
  },
  fontSize: 'sm',
});

const secondary = defineStyle({
  width: 'full',
  bgColor: 'initial',
  borderWidth: 1,
  borderColor: 'section.200',
  color: 'section.200',
  _hover: {
    color: 'button.500',
    borderColor: 'button.500',
    _disabled: {
      bgColor: 'initial',
    },
  },
  fontSize: 'sm',
});

const tertiary = defineStyle({
  bgColor: 'error.600',
  borderWidth: 1,
  color: 'error.500',
  _hover: {
    _disabled: {
      bgColor: 'initial',
    },
  },
  fontSize: {
    base: 'sm',
    sm: 'md',
  },
});

const ghosted = defineStyle({
  bgColor: 'semi-transparent',
  color: 'section.200',
  _hover: {
    color: 'button.500',
    bgColor: 'initial',
  },
});

const icon = defineStyle({
  bgColor: 'grey.800',
  color: 'grey.200',
  fontSize: 'xl',
});

const baseStyle = defineStyle({
  borderRadius: 8,
  fontWeight: 'semibold',
  color: 'black',
});

const Button = defineStyleConfig({
  baseStyle,
  variants: {
    icon,
    primary,
    secondary,
    tertiary,
    ghosted,
  },
});

export { Button };
