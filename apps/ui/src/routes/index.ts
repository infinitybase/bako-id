import {
  createRouter,
} from '@tanstack/react-router';
import { rootRoute } from '../hooks/__root.ts';
import { buyRoute, connectRoute, domainRoute, homeRoute } from './childrens.ts';

const routeTree = rootRoute.addChildren([homeRoute, connectRoute, domainRoute, buyRoute])

export const router = createRouter({ routeTree, context: {
  isConnected: null
}})
