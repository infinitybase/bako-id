import { Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import '../../theme/global.css';
import { Header } from '../header';
import { Container } from './container';
import { ProfileLayout } from './profile';

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

const MainLayout = () => {
  const { location } = useRouterState();

  if (location.pathname.includes('/profile/')) {
    return <DashboardLayout />;
  }

  return <Layout />;
};

export { DashboardLayout, Layout, MainLayout };
