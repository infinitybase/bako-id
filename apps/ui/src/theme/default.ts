import { extendTheme } from '@chakra-ui/react';
import { breakpoints } from './breakpoints.ts';
import { colors } from './colors';
import { components } from './components';

const defaultTheme = extendTheme({
  initialColorMode: 'dark',
  colors,
  breakpoints,
  components: {
    ...components,
  },
  styles: {
    global: () => ({
      body: {
        bg: 'background.600',
        color: '#FFFFFF',
        fontSize: {
          base: 'sm',
          sm: 'md',
        },
      },
      '#chakra-toast-manager-top-right': {
        mt: 20,
      },
      '.fuel-connectors': {
        zIndex: '9999 !important', // Ensure connectors are above other elements
      },
    }),
  },
});

export { defaultTheme };
