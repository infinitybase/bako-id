import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import {
  buyRoute,
  connectRoute,
  homeRoute,
  learnMoreRoute,
  marketplaceRoute,
  marketplaceCollectionRoute,
  moreRoute,
  myHandlesRoute,
  profileRoute,
  marketplaceProfileRoute,
} from './childrens.ts';

const routeTree = rootRoute.addChildren([
  homeRoute,
  connectRoute,
  buyRoute,
  profileRoute,
  moreRoute,
  learnMoreRoute,
  myHandlesRoute,
  marketplaceRoute,
  marketplaceCollectionRoute,
  marketplaceProfileRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    isConnected: null,
  },
});
