import { cssVar, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const custom = defineStyle({
  _light: {
    [$startColor.variable]: 'colors.grey.600',
    [$endColor.variable]: 'colors.grey.300',
  },
  _dark: {
    [$startColor.variable]: 'colors.grey.600',
    [$endColor.variable]: 'colors.grey.300',
  },
});

export const Skeleton = defineStyleConfig({
  baseStyle: {
    ...custom,
  },
  defaultProps: {
    variant: 'custom',
  },
  variants: {
    custom,
  },
});
