import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const buttonDropdown = definePartsStyle({
  button: {
    fontWeight: 'medium',
    borderColor: 'grey.600',
    bg: 'background.900',
    color: 'text.700',
    _hover: {
      bg: 'teal.600',
      color: 'white',
    },
  },
  list: {
    borderRadius: 'xl',
    borderColor: 'grey.600',
    bg: 'background.900',
    p: 0,
    overflow: 'hidden',
  },
  item: {
    color: 'text.700',
    bg: 'background.900',
    py: 4,
    px: 5,
    fontSize: 'sm',
    borderBottom: '1px solid',
    borderColor: 'grey.600',
    '& .chakra-menu__icon-wrapper': {
      mr: 4,
    },
  },
  groupTitle: {
    textTransform: 'uppercase',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 'wider',
    opacity: '0.7',
  },
  divider: {
    my: '4',
    borderColor: 'grey.600',
    borderBottom: '1px solid',
  },
});
// export the base styles in the component theme
export const Menu = defineMultiStyleConfig({
  variants: {
    buttonDropdown,
  },
});
