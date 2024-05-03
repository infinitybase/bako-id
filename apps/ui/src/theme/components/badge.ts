import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const success = defineStyle({
  bgColor: 'success.900',
  color: 'success.500',
  borderColor: 'success.900',
});

const error = defineStyle({
  bgColor: 'rgba(240, 93, 72, 0.1)',
  color: 'error.500',
  borderColor: 'rgba(240, 93, 72, 0.25)',
});

const warning = defineStyle({
  bgColor: 'warning.900',
  color: 'warning.500',
  borderColor: 'warning.900',
});

const darkWarning = defineStyle({
  bgColor: 'rgba(241, 101, 23, 0.1)',
  color: 'warning.650',
  borderColor: 'rgba(241, 101, 23, 0.25)',
});

const info = defineStyle({
  bgColor: 'rgba(0, 244, 139, 0.1)',
  color: 'success.600',
  borderColor: 'rgba(0, 244, 139, 0.25)',
});

const blue = defineStyle({
  bgColor: 'rgba(50,200,217,0.1)',
  color: '#32C8D9',
  borderColor: 'rgba(50,200,217,0.25)',
});

const yellow = defineStyle({
  bgColor: 'rgba(227, 175, 19, 0.1)',
  color: 'brand.500',
  borderColor: 'rgba(227, 175, 19, 0.25)',
});

const gray = defineStyle({
  bgColor: 'rgba(245,246,250,0.1)',
  color: '#F5F6FA',
  borderColor: 'rgba(245,246,250,0.1)',
});

const grey = defineStyle({
  bgColor: 'rgba(44,44,44,0.8)',
  color: 'grey.200',
  borderColor: 'rgba(73,248,174,0.1)',
});

const baseStyle = defineStyle({
  fontSize: 'xs',
  fontWeight: 'normal',
  textTransform: 'initial',
  borderWidth: 1,
  paddingBlock: 0,
  height: 6,
  paddingInline: 1.5,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  borderRadius: 'md',
  maxWidth: 'min-content',
});

const Badge = defineStyleConfig({
  baseStyle,
  variants: {
    error,
    success,
    warning,
    info,
    gray,
    blue,
    yellow,
    grey,
    darkWarning,
  },
});

export { Badge };
