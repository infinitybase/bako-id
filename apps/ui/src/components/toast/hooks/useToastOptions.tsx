import { useToast, UseToastOptions } from '@chakra-ui/react';
import { Toast } from '../container';

const useToastOptions = (options?: UseToastOptions) => {
  return useToast({
    containerStyle: {
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'column',
      minW: 'min-content',
    },
    position: 'top-right',
    render: (props) => <Toast {...props} />,
    ...options,
  });
};

export { useToastOptions };
