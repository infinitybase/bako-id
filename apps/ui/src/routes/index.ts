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

export const resolveRouterTree = () => {
  const { hostname, pathname } = new URL(window.location.href);
  const [subdomain] = hostname.split('.');
  const isDev = import.meta.env.DEV;

  if (isDev && subdomain === 'marketplace') {
    return marketplaceRouterTree;
  }

  if (!isDev && pathname.includes('marketplace')) {
    const newPathname = pathname.replace('/marketplace', '/');
    window.history.replaceState({}, '', newPathname);
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
