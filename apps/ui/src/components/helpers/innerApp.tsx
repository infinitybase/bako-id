import { useFuelConnect } from '../../hooks';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../../routes';

export function InnerApp() {
  const { isConnected } = useFuelConnect()

  if(isConnected === null) return;

  return <RouterProvider router={router} context={{ isConnected }}/>
}
