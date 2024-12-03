import { createRoute } from '@tanstack/react-router';
import { NotConnected } from '../components';
import { Buy } from '../modules/buy/page.tsx';
import { LearnMore } from '../modules/home/components/learn-more/page.tsx';
import { Home } from '../modules/home/page.tsx';
import { MyHandles } from '../modules/myHandles/page.tsx';
import { More } from '../modules/profile/components/more/page.tsx';
import { ProfileExternal } from '../modules/profile/pages/external-page.tsx';
import { ProfileInternal } from '../modules/profile/pages/internal-page.tsx';
import { rootRoute } from './__root.ts';

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

export const profileInternalRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ProfileInternal,
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

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ProfileExternal,
  path: '/$externalDomain',
});
