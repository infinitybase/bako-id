import { defineStyle } from '@chakra-ui/react';

import { inputStyle } from './input';

const baseStyleHelperText = defineStyle({
  color: 'grey.200',
  fontSize: 'xs',
  _invalid: {
    color: 'error.500',
  },
});

const activeLabelStyles = {
  transform: 'scale(0.7) translateY(-6px)',
  top: 0,
};

const floating = defineStyle({
  _focusWithin: {
    label: {
      ...activeLabelStyles,
    },
  },
  'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
    {
      ...activeLabelStyles,
    },
  '.chakra-input__group:not(:has(input:placeholder-shown)) + label': {
    ...activeLabelStyles,
  },
  '&:not(:has(label)) select': {
    py: 2,
  },
  label: {
    top: '5px',
    left: '-8px',
    zIndex: 2,
    position: 'absolute',
    pointerEvents: 'none',
    mx: 5,
    px: 1,
    my: 2,
    transformOrigin: 'left top',
    color: 'grey.200',
  },
  input: inputStyle.field,
  select: inputStyle.field,
});

const baseStyle = {
  container: floating,
  helperText: baseStyleHelperText,
};

const Form = {
  baseStyle,
};

export { Form };
