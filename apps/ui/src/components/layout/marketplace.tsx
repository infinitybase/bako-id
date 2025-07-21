import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Container } from './container';
import { Content } from './content';
import { MarketplaceHeader } from '@/modules/marketplace/components';
import MarketplaceBg from '@/assets/marketplace/bg-desktop.png';
import { useRouterState } from '@tanstack/react-router';

interface MarketplaceLayoutProps {
  children?: React.ReactNode;
}

const MarketplaceMainLayout = (props: MarketplaceLayoutProps) => {
  const { location } = useRouterState();
  const params = location.pathname.split('/');
  const isCollectionRoute = params.includes('collection');

  return (
    <>
      <Container
        h="full"
        overflowY="auto"
        backgroundImage={isCollectionRoute ? 'none' : MarketplaceBg}
        bg={isCollectionRoute ? 'input.900' : 'transparent'}
      >
        <MarketplaceHeader />
        <Content px={0}>{props.children}</Content>
        {import.meta.env.NODE_ENV === 'development' && (
          <TanStackRouterDevtools />
        )}
      </Container>
    </>
  );
};

export { MarketplaceMainLayout };
export const MarketplaceLayout = MarketplaceMainLayout;
