import { Icon, type IconProps } from '@chakra-ui/react';
import { ExploreIcon } from '..';
import type { ExplorerTypes } from '../../types';

interface ExplorerProps extends IconProps {
  id: string;
  type: ExplorerTypes;
}

const Explorer = ({ id, type, ...rest }: ExplorerProps) => {
  return (
    <Icon
      as={ExploreIcon}
      onClick={() => {
        window.open(
          `${import.meta.env.VITE_EXPLORER_URL}${id}${type}`,
          '_blank',
        );
      }}
      {...rest}
    />
  );
};

export { Explorer };
