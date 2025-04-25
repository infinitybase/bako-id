import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const inputActiveStyle = {
  borderColor: 'section.200',
  color: 'white',
  bg: 'dark.250',
  boxShadow:
    // '0 0 0 3px color-mix(in srgb, var(--chakra-colors-brand-500)) 70%, transparent)',
    '0 0 0 3px color-mix(in srgb, var(--chakra-colors-section-200) 50%, transparent)',
  '~ .chakra-input__right-element': {
    background: 'dark.250',
  },
};

const inputInvalidStyle = {
  borderColor: 'error.500',
  bg: 'dark.250',
  boxShadow: 'error.600',
  '~ .chakra-input__right-element': {
    background: 'dark.250',
  },
};

const baseStyle = defineStyle({
  field: {
    bg: 'dark.250',
    color: 'section.200',
    fontSize: 'md',
    borderColor: 'grey.600',
    boxShadow: 'none',
    borderWidth: 1,
    borderRadius: 10,
    _hover: {
      borderColor: 'dark.100',
    },
    _blur: {
      background: 'dark.250',
    },
    _placeholder: {
      color: 'grey.200',
      fontWeight: 'medium',
    },
    _invalid: inputInvalidStyle,
  },
  addon: {},
  element: {},
});

const autocomplete = defineStyle({
  field: {
    ...baseStyle.field,
    height: 'auto',
    pt: 5,
    pb: 1,
    px: 5,
    _focus: inputActiveStyle,
    _focusVisible: inputActiveStyle,
    _invalid: inputInvalidStyle,
  },
});

const outlined = defineStyle({
  field: {
    pt: 5,
    pb: 1,
    px: 4,
    bgColor: 'input.900',
    color: 'text.700',
    _focus: inputActiveStyle,
    _focusVisible: inputActiveStyle,
    _invalid: inputInvalidStyle,
  },
});

const Input = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'grey',
  },
  variants: {
    custom: baseStyle,
    autocomplete,
    outlined,
  },
});

const Textarea = Input;

export { Input, baseStyle as inputStyle, Textarea };
