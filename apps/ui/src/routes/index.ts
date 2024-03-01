import {
  createRouter,
} from '@tanstack/react-router';
import { rootRoute } from '../hooks/__root.ts';
import { connectRoute, homeRoute } from './childrens.ts';

const routeTree = rootRoute.addChildren([homeRoute, connectRoute])

export const router = createRouter({ routeTree, context: {
  isConnected: null
}})
