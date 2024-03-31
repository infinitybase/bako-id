import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import '../../theme/global.css';
import { Header } from '../header';
import { Container } from './container';
// import { useIsConnected } from '@fuels/react';

const Layout = () => {
  // const { isConnected} = useIsConnected();
  // const routerState = useRouterState();
  // const path = routerState.location.pathname
  // const navigate = useNavigate()
  //
  // if(!isConnected && path !== '/auth') {
  //   navigate({ to: 'auth' }).then()
  // }
  //
  // if(isConnected && path !== '/') {
  //   navigate({ to: '/' }).then()
  // }

  return (
    <Container>
      <Header />
      <Outlet />
      {import.meta.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </Container>
  );
};

export { Layout };
