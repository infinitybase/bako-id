import { Container } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { BackgroundTexture } from '../helpers/backgroundTexture.tsx';
import '../../theme/global.css'
import { Header } from '../header';

const Layout = () => {

  return (
    <Container w="full" maxW="full" position="relative" h="100vh" bgColor="background.500" display="flex" flexDir="column" padding={0}>
      <Header />
      <BackgroundTexture />
      <Outlet />
      <TanStackRouterDevtools />
    </Container>
  )
}

export { Layout }
