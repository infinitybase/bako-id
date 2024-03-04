import '../../theme/global.css'
import { Center, Container } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { BackgroundTexture } from '../helpers/backgroundTexture.tsx';
import { Header } from '../header';
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
    <Container w="full" maxW="full" h="100vh" bgColor="background.500" display="flex" flexDir="column" padding={0} overflow="hidden">
      <Header />
      <Center position="relative" w="full" h="full" overflowX="hidden">
        <BackgroundTexture />
        <Outlet />
      </Center>
      <TanStackRouterDevtools />
    </Container>
  )
}

export { Layout }
