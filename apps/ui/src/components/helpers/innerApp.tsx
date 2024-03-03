import { RouterProvider } from '@tanstack/react-router';
import { router } from '../../routes';
import { useIsConnected } from '@fuels/react';

export function InnerApp() {
  const { isConnected} = useIsConnected();
  console.debug(isConnected)

  if(isConnected === null) return;

  if(!isConnected) {
    // throw redirect({
    //   to: '/connect',
    // })
  }

  return <RouterProvider router={router} context={{ isConnected }}/>
}
