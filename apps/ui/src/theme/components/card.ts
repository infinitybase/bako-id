import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const commonStyles = {
  dialog: {
    py: 9,
    px: 6,
  },
  container: {
    backgroundColor: 'rgba(243, 242, 241, 0.02)',
    backdropFilter: 'blur(3px)',
  },
  header: {
    p: 0,
  },
  body: {
    p: 0,
  },
};

const glassmorphic = defineStyle({
  container: {
    ...commonStyles.container,
  },
  header: {
    ...commonStyles.header,
  },
  body: {
    ...commonStyles.body,
  },
});

const solid = defineStyle({
  container: {
    ...commonStyles.container,
  },
  header: {
    ...commonStyles.header,
  },
  body: {
    ...commonStyles.body,
  },
});

const Card = defineStyleConfig({
  defaultProps: {
    variant: 'glassmorphic',
  },
  variants: {
    glassmorphic,
    solid,
  },
});

export { Card };
