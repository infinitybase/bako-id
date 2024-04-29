import { useToast, type UseToastOptions } from '@chakra-ui/react';
import { Toast } from '../container';

const useToastOptions = (options?: UseToastOptions) => {
  return useToast({
    position: 'top-right',
    render: (props) => <Toast {...props} />,
    ...options,
  });
};

export { useToastOptions };
