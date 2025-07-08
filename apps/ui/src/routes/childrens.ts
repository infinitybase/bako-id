import { MarketplacePage } from '@/modules/marketplace/page.tsx';
import { createRoute } from '@tanstack/react-router';
import { NotConnected } from '../components';
import { Buy } from '../modules/buy/page.tsx';
import { LearnMore } from '../modules/home/components/learn-more/page.tsx';
import { Home } from '../modules/home/page.tsx';
import { MyHandles } from '../modules/myHandles/page.tsx';
import { More } from '../modules/profile/components/more/page.tsx';
import { Profile } from '../modules/profile/page.tsx';
import { rootRoute } from './__root.ts';
import { ProfilePage } from '@/modules/marketplace/components/profilePage.tsx';
import { CollectionPage } from '@/modules/marketplace/collections/page.tsx';

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
  getParentRoute: () => rootRoute,
  component: MarketplacePage,
  path: '/marketplace',
});

export const marketplaceCollectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: CollectionPage,
  path: '/marketplace/collection/$collectionId',
  context(ctx) {
    return {
      collectionId: ctx.params.collectionId,
    };
  },
});
export const marketplaceProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ProfilePage,
  path: '/marketplace/profile/$name',
});
