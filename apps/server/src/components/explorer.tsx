import { Icon, type IconProps } from '@chakra-ui/react';
import { ExploreIcon } from './icons';

export enum ExplorerTypes {
  ASSETS = '/assets',
  TRANSACTIONS = '/transactions',
}

interface ExplorerProps extends IconProps {
  id?: string;
  type?: ExplorerTypes;
  redirectLink?: string;
  explorerUrl?: string;
}

const Explorer = ({
  id,
  type,
  redirectLink,
  explorerUrl,
  ...rest
}: ExplorerProps) => {
  return (
    <Icon
      as={ExploreIcon}
      onClick={() => {
        window.open(
          redirectLink ??
            `${explorerUrl ?? process.env.NEXT_PUBLIC_EXPLORER_URL}/account/${id}${type}`,
          '_blank'
        );
      }}
      {...rest}
    />
  );
};

export { Explorer };
