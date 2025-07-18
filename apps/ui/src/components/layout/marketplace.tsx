import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Container } from './container';
import { Content } from './content';
import { MarketplaceHeader } from '@/modules/marketplace/components';
import MarketplaceBg from '@/assets/marketplace/bg-desktop.png';

interface MarketplaceLayoutProps {
  children?: React.ReactNode;
}

const MarketplaceMainLayout = (props: MarketplaceLayoutProps) => {
  return (
    <>
      <Container h="full" overflowY="auto" backgroundImage={MarketplaceBg}>
        <MarketplaceHeader />
        <Content>{props.children}</Content>
        {import.meta.env.NODE_ENV === 'development' && (
          <TanStackRouterDevtools />
        )}
      </Container>
    </>
  );
};

export { MarketplaceMainLayout };
export const MarketplaceLayout = MarketplaceMainLayout;
