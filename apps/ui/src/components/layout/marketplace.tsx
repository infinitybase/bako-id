import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Container } from './container';
import { Content } from './content';
import { MarketplaceHeader } from '@/modules/marketplace/components';
import { useOrderEventPolling } from '@/hooks/marketplace/useOrderEventPolling';

interface MarketplaceLayoutProps {
  children?: React.ReactNode;
}

const MarketplaceMainLayout = (props: MarketplaceLayoutProps) => {
  // Initialize the polling for order events
  useOrderEventPolling();
  return (
    <Container h="full" overflowY="auto" bg="input.900" backgroundImage="none">
      <MarketplaceHeader />
      <Content px={0} mt="70px" py={0}>
        {props.children}
      </Content>
      {import.meta.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </Container>
  );
};
export { MarketplaceMainLayout };
export const MarketplaceLayout = MarketplaceMainLayout;
