import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import '../../theme/global.css';
import { Header } from '../header';
import { Container } from './container';
// import { useIsConnected } from '@fuels/react';

const Layout = () => {
  return (
    <Container>
      <Header />
      <Outlet />
      {import.meta.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </Container>
  );
};

export { Layout };
