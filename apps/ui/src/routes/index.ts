import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import {
  buyRoute,
  connectRoute,
  homeRoute,
  learnMoreRoute,
  moreRoute,
  myHandlesRoute,
  profileInternalRoute,
  profileRoute,
} from './childrens.ts';

const routeTree = rootRoute.addChildren([
  homeRoute,
  connectRoute,
  buyRoute,
  profileInternalRoute,
  moreRoute,
  learnMoreRoute,
  myHandlesRoute,
  profileRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    isConnected: null,
  },
});
