import { CollectionPage } from '@/modules/marketplace/collections/page.tsx';
import OrderPage from '@/modules/marketplace/order/page.tsx';
import { MarketplacePage } from '@/modules/marketplace/page.tsx';
import { createRoute } from '@tanstack/react-router';
import { NotConnected } from '../components';
import { Buy } from '../modules/buy/page.tsx';
import { LearnMore } from '../modules/home/components/learn-more/page.tsx';
import { Home } from '../modules/home/page.tsx';
import { MyHandles } from '../modules/myHandles/page.tsx';
import { More } from '../modules/profile/components/more/page.tsx';
import { Profile } from '../modules/profile/page.tsx';
import { marketplaceRootRoute, rootRoute } from './__root.ts';
import { ProfilePage } from '@/modules/marketplace/profile/page.tsx';

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Home,
  path: '/',
});

export const learnMoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: LearnMore,
  path: '/learn-more',
});

export const connectRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: NotConnected,
  path: '/auth',
});

export const buyRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Buy,
  path: '/buy/$domain',
});

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Profile,
  path: '/profile/$domain',
});

export const moreRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: More,
  path: '/profile/$domain/more',
});

export const myHandlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: MyHandles,
  path: '/my-handles',
});

export const marketplaceRoute = createRoute({
  getParentRoute: () => marketplaceRootRoute,
  component: MarketplacePage,
  path: '/',
});

export const marketplaceCollectionRoute = createRoute({
  getParentRoute: () => marketplaceRootRoute,
  component: CollectionPage,
  path: '/collection/$collectionName',
  context(ctx) {
    return {
      collectionName: ctx.params.collectionName,
    };
  },
});

export const marketplaceCollectionMintRoute = createRoute({
  getParentRoute: () => marketplaceRootRoute,
  component: CollectionPage,
  path: '/collection/$collectionName/mint',
  context(ctx) {
    return {
      collectionName: ctx.params.collectionName,
    };
  },
});

export const marketplaceProfileRoute = createRoute({
  getParentRoute: () => marketplaceRootRoute,
  component: ProfilePage,
  path: '/profile/$name',
});

export const orderRoute = createRoute({
  getParentRoute: () => marketplaceCollectionRoute,
  component: OrderPage,
  path: '/collection/$collectionName/order/$orderId',
});
