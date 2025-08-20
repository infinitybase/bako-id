import { createRouter } from '@tanstack/react-router';
import { marketplaceRootRoute, rootRoute } from './__root';
import {
  buyRoute,
  connectRoute,
  homeRoute,
  learnMoreRoute,
  marketplaceCollectionRoute,
  marketplaceProfileRoute,
  marketplaceRoute,
  moreRoute,
  myHandlesRoute,
  orderRoute,
  profileRoute,
} from './childrens.ts';

const bakoIdRouterTree = rootRoute.addChildren([
  homeRoute,
  connectRoute,
  buyRoute,
  profileRoute,
  moreRoute,
  learnMoreRoute,
  myHandlesRoute,
]);

const marketplaceRouterTree = marketplaceRootRoute.addChildren([
  marketplaceRoute.addChildren([orderRoute]),
  marketplaceCollectionRoute,
  marketplaceProfileRoute,
]);

export const shouldRenderMarketplace = () => {
  const { hostname, pathname } = new URL(window.location.href);

  const environment = import.meta.env.VITE_ENVIRONMENT;
  const isDev = import.meta.env.DEV;
  const isPreview = environment === 'preview';

  // Production: Use marketplace router for 'garage' domain
  if (hostname.includes('garage')) {
    return true;
  }

  // Development: Use marketplace router for 'marketplace' subdomain
  if (isDev) {
    const [subdomain] = hostname.split('.');
    if (subdomain === 'marketplace') {
      return true;
    }
  }

  // Development/Preview: Handle marketplace pathname
  if ((isDev || isPreview) && pathname.includes('marketplace')) {
    return true;
  }

  // Default: Return false (bakoId router)
  return false;
};

export const resolveRouterTree = () => {
  const isMarketplace = shouldRenderMarketplace();

  if (isMarketplace) {
    // Handle pathname replacement for marketplace
    const { pathname } = new URL(window.location.href);
    const environment = import.meta.env.VITE_ENVIRONMENT;
    const isDev = import.meta.env.DEV;
    const isPreview = environment === 'preview';

    if ((isDev || isPreview) && pathname.includes('marketplace')) {
      const newPathname = pathname.replace(
        '/marketplace',
        pathname === '/marketplace' ? '/' : ''
      );
      window.history.replaceState(null, '', newPathname);
    }

    return marketplaceRouterTree;
  }

  return bakoIdRouterTree;
};

export const router = createRouter({
  routeTree: resolveRouterTree(),
  context: {
    isConnected: null,
  },
});
