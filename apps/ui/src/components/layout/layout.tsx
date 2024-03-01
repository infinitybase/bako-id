import { Center } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const Layout = () => {
  return (
    <Center w="full" h="100vh" bgColor="bg-500">
      <Outlet />
      <TanStackRouterDevtools />
    </Center>
  )
}

export { Layout }
