import { Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { isB256 } from 'fuels';
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
  const params = location.pathname.split('/');
  const isProfileRoute =
    location.pathname.includes('/profile/') && !isB256(params[2]);

  if (isProfileRoute) {
    return <DashboardLayout />;
  }

  return <Layout />;
};

export { DashboardLayout, Layout, MainLayout };
