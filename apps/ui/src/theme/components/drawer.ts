import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const commonStyles = {
  dialog: {
    py: 9,
    px: 6,
  },
  overlay: {
    background: 'rgba(18, 18, 18, 0.10)',
    backdropFilter: 'blur(12px)',
  },
  header: {
    p: 0,
  },
  body: {
    p: 0,
  },
};

const glassmorphic = defineStyle({
  dialog: {
    ...commonStyles.dialog,
    bg: 'rgba(12, 12, 12, 0.8)',
  },
  overlay: {
    ...commonStyles.overlay,
  },
  header: {
    ...commonStyles.header,
  },
  body: {
    ...commonStyles.body,
  },
});

const solid = defineStyle({
  dialog: {
    ...commonStyles.dialog,
    bg: 'background.900',
  },
  overlay: {
    ...commonStyles.overlay,
  },
  header: {
    ...commonStyles.header,
  },
  body: {
    ...commonStyles.body,
  },
});

const Drawer = defineStyleConfig({
  defaultProps: {
    variant: 'glassmorphic',
  },
  variants: {
    glassmorphic,
    solid,
  },
});

const Modal = defineStyleConfig({
  defaultProps: {
    variant: 'glassmorphic',
  },
  variants: {
    glassmorphic: {
      ...glassmorphic,
      dialog: {
        ...glassmorphic.dialog,
        bg: '#17181B',
      },
    },
  },
});

export { Drawer, Modal };
