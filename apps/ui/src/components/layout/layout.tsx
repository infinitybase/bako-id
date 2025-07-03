import { Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { isB256 } from 'fuels';
import { useMemo } from 'react';
import '../../theme/global.css';
import { Header } from '../header';
import { Container } from './container';
import { ProfileLayout } from './profile';
import { MarketplaceMainLayout } from './marketplace';

// import { useIsConnected } from '@fuels/react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  hasSideBar?: boolean;
}

const Layout = () => (
  <Container>
    <Header />
    <Outlet />
    {import.meta.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
  </Container>
);

const DashboardLayout = (props: DashboardLayoutProps) => (
  <ProfileLayout {...props}>
    <Outlet />
  </ProfileLayout>
);

export const MarketplaceLayout = () => {
  return (
    <MarketplaceMainLayout>
      <Outlet />
    </MarketplaceMainLayout>
  );
};

const MainLayout = () => {
  const { location } = useRouterState();
  const params = location.pathname.split('/');
  const isHandle = useMemo(() => !isB256(params[2] ?? ''), [params]);
  const isProfileRoute = location.pathname.includes('/profile/') && isHandle;
  const isMarketplaceRoute =
    location.pathname === '/marketplace' ||
    location.pathname.startsWith('/marketplace/');

  if (isMarketplaceRoute) {
    return <MarketplaceLayout />;
  }

  if (isProfileRoute) {
    return <DashboardLayout />;
  }

  return <Layout />;
};

export { DashboardLayout, Layout, MainLayout };
