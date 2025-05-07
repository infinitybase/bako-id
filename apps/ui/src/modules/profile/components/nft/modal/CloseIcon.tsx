import { CloseIcon as CustomCloseIcon } from '@/components/icons/closeIcon';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';

interface CloseIconProps
  extends Omit<IconButtonProps, 'aria-label' | 'onClick'> {
  onClose: () => void;
}

export const CloseIcon = ({ onClose, ...props }: CloseIconProps) => {
  return (
    <IconButton
      onClick={onClose}
      position="absolute"
      top={4}
      right={4}
      aria-label="Close modal"
      variant="icon"
      {...props}
    >
      <CustomCloseIcon />
    </IconButton>
  );
};
