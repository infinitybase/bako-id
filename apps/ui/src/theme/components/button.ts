import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  width: 'full',
  bgColor: 'button.500',
  color: 'input.900',
  _hover: {
    opacity: 0.8,
    _disabled: {
      opacity: 0.8,
      bgColor: 'button.500',
    },
  },

  _disabled: {
    opacity: 0.5,
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
  borderColor: 'error.600',
  color: 'input.600',
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

const mktPrimary = defineStyle({
  w: 'full',
  bgColor: 'button.800',
  color: 'input.600',
  _hover: {
    opacity: 0.8,
    _disabled: {
      opacity: 0.8,
      bgColor: 'button.800',
    },
  },

  _disabled: {
    opacity: 0.5,
  },

  fontSize: 'sm',
});

const ghosted = defineStyle({
  bgColor: 'semi-transparent',
  fontWeight: 'normal',
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

const customLink = defineStyle({
  bgColor: 'transparent',
  color: 'grey.100',
  _hover: {
    color: 'button.500',
    bgColor: '#FFC0101A',
  },
  _active: {
    color: 'button.500',
    bgColor: '#FFC0101A',
  },
  fontSize: 'sm',
  fontWeight: 'normal',
});

const baseStyle = defineStyle({
  borderRadius: 8,
  fontWeight: 'semibold',
  color: 'black',
  _disabled: {
    _hover: {},
  },
});

const Button = defineStyleConfig({
  baseStyle,
  variants: {
    icon,
    primary,
    secondary,
    tertiary,
    ghosted,
    customLink,
    mktPrimary,
  },
});

export { Button };
