import { useIsConnected } from '@fuels/react';
import { RouterProvider } from '@tanstack/react-router';
import { Suspense } from 'react';
import { router } from '../../routes';

export function InnerApp() {
  const { isConnected } = useIsConnected();

  if (isConnected === null) return;

  return (
    <Suspense>
      <RouterProvider router={router} context={{ isConnected }} />
    </Suspense>
  );
}
