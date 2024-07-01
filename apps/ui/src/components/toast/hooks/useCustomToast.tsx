import { Icon } from '@chakra-ui/icons';
import { BsFillCheckCircleFill } from 'react-icons/bs';

import { ErrorIcon } from '../..';
import { InfoIcon } from '../../icons/infoIcon';
import { WarningIcon } from '../../icons/warningIcon';
import { useToastOptions } from './useToastOptions';
interface ToastParams {
  description?: string;
  title?: string;
}

const useCustomToast = () => {
  const toast = useToastOptions();

  const successToast = ({ description, title }: ToastParams) =>
    toast({
      status: 'success',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Success!',
      description: description ?? '',
      icon: <Icon fontSize="xl" color="brand.500" as={BsFillCheckCircleFill} />,
    });

  const infoToast = ({ description, title }: ToastParams) => {
    toast({
      status: 'info',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Info!',
      description: description ?? '',
      icon: <Icon fontSize="2xl" color="info.500" as={InfoIcon} />,
    });
  };

  const warningToast = ({ description, title }: ToastParams) => {
    toast({
      status: 'warning',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Warning!',
      description: description ?? '',
      icon: <Icon fontSize="2xl" color="warning.500" as={WarningIcon} />,
    });
  };

  const errorToast = ({ description, title }: ToastParams) => {
    toast({
      status: 'error',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Error!',
      description:
        description ?? 'Check the provided data and try again, please...',
      icon: (
        <Icon fontSize="2xl" color="error.600" w={5} h={5} as={ErrorIcon} />
      ),
    });
  };

  const createAndUpdateSuccessToast = () =>
    successToast({
      title: 'Nice!',
      description:
        'Next time you can use it just by typing this name label or address...',
    });

  return {
    successToast,
    errorToast,
    createAndUpdateSuccessToast,
    warningToast,
    infoToast,
  };
};

export { useCustomToast };
