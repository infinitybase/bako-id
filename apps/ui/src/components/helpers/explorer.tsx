import { Icon, type IconProps } from '@chakra-ui/react';
import { ExploreIcon } from '..';
import type { ExplorerTypes } from '../../types';

interface ExplorerProps extends IconProps {
  id: string;
  type: ExplorerTypes;
  explorerUrl?: string;
}

const Explorer = ({ id, type, explorerUrl, ...rest }: ExplorerProps) => {
  return (
    <Icon
      as={ExploreIcon}
      onClick={() => {
        window.open(
          `${explorerUrl ?? import.meta.env.VITE_EXPLORER_URL}${id}${type}`,
          '_blank',
        );
      }}
      {...rest}
    />
  );
};

export { Explorer };
