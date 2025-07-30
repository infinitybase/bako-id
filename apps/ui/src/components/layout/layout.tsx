import { Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { isB256 } from 'fuels';
import { useMemo } from 'react';
import '../../theme/global.css';
import { Header } from '../header';
import { Container } from './container';
import { MarketplaceMainLayout } from './marketplace';
import { ProfileLayout } from './profile';
import { ProcessingOrdersProvider } from '@/contexts/ProcessingOrdersContext';

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
    <ProcessingOrdersProvider>
      <MarketplaceMainLayout>
        <Outlet />
      </MarketplaceMainLayout>
    </ProcessingOrdersProvider>
  );
};

const MainLayout = () => {
  const { location } = useRouterState();
  const params = location.pathname.split('/');
  const isHandle = useMemo(() => !isB256(params[2] ?? ''), [params]);
  const isProfileRoute = location.pathname.includes('/profile/') && isHandle;

  if (isProfileRoute) {
    return <DashboardLayout />;
  }

  return <Layout />;
};

export { DashboardLayout, Layout, MainLayout };
