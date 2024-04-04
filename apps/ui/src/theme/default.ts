import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { breakpoints } from './breakpoints.ts';

const defaultTheme = extendTheme({
  initialColorMode: 'dark',
  colors,
  breakpoints,
});

export { defaultTheme };
