import { Icon, type IconProps } from '@chakra-ui/react';
import { ExploreIcon } from '..';
import type { ExplorerTypes } from '../../types';

interface ExplorerProps extends IconProps {
  id?: string;
  type?: ExplorerTypes;
  redirectLink?: string;
}

const Explorer = ({ id, type, redirectLink, ...rest }: ExplorerProps) => {
  return (
    <Icon
      as={ExploreIcon}
      onClick={() => {
        window.open(
          redirectLink ?? `${import.meta.env.VITE_EXPLORER_URL}${id}${type}`,
          '_blank',
        );
      }}
      {...rest}
    />
  );
};

export { Explorer };
