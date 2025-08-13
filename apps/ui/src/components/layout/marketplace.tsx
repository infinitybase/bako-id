import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Container } from './container';
import { Content } from './content';
import { MarketplaceHeader } from '@/modules/marketplace/components';
import { useOrderEventPolling } from '@/hooks/marketplace/useOrderEventPolling';
import { useProvider } from '@fuels/react';
import { useEffect, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';

interface MarketplaceLayoutProps {
  children?: React.ReactNode;
}

const MarketplaceMainLayout = (props: MarketplaceLayoutProps) => {
  // Initialize the polling for order events
  useOrderEventPolling();

  const { provider } = useProvider();

  const router = useRouter();

  const prevUrlRef = useRef<string | undefined>(provider?.url);

  useEffect(() => {
    const currentUrl = provider?.url;
    const prevUrl = prevUrlRef.current;

    if (prevUrl && currentUrl && prevUrl !== currentUrl) {
      router.navigate({ to: '/', replace: true });
    }

    prevUrlRef.current = currentUrl;
  }, [provider?.url, router]);

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
