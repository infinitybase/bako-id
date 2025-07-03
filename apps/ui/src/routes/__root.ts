import { createRootRouteWithContext } from '@tanstack/react-router';
import {
  DashboardLayout,
  MainLayout,
  MarketplaceLayout,
} from '../components/layout';

interface MyRouterContext {
  isConnected: boolean | null;
}

export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: MainLayout,
});

export const profileRootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: DashboardLayout,
});

export const marketplaceRootRoute =
  createRootRouteWithContext<MyRouterContext>()({
    component: MarketplaceLayout,
  });
