import { CheckIcon } from '@chakra-ui/icons';
import { Icon, useClipboard } from '@chakra-ui/react';
import { CopyIcon } from '../icons/copyIcon';
import { CopyIcon2 } from '@/modules/marketplace/components/icons/copyIcon';

const CopyText = ({
  value,
  color,
  useNewCopyIcon,
}: { value: string; color?: string; useNewCopyIcon?: boolean }) => {
  const { onCopy, hasCopied } = useClipboard(value);
  const IconState = hasCopied
    ? CheckIcon
    : useNewCopyIcon
      ? CopyIcon2
      : CopyIcon;

  return (
    <Icon
      as={IconState}
      onClick={onCopy}
      cursor="pointer"
      color={color}
      _hover={{ color: 'white' }}
    />
  );
};

export { CopyText };
