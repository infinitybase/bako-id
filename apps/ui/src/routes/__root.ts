import { createRootRouteWithContext } from '@tanstack/react-router';
import { DashboardLayout, MainLayout } from '../components/layout';

interface MyRouterContext {
  isConnected: boolean | null;
}

export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: MainLayout,
});

export const profileRootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: DashboardLayout,
});
