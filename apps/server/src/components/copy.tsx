'use client';

import { CheckIcon } from '@chakra-ui/icons';
import { Icon, useClipboard } from '@chakra-ui/react';
import { CopyIcon } from './icons/copyIcon';

const CopyText = ({ value }: { value: string }) => {
  const { onCopy, hasCopied } = useClipboard(value);
  const IconState = hasCopied ? CheckIcon : CopyIcon;

  return <Icon as={IconState} onClick={onCopy} cursor="pointer" />;
};

export { CopyText };
