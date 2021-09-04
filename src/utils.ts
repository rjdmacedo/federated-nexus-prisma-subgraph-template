import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import type { ApolloServer } from 'apollo-server-express';

/** APP_SECRET is used to sign JWT tokens and verifying them later */
export const APP_SECRET = 'CHANGE-ME';
/** Prisma client used to access the data layer */
export const prisma = new PrismaClient({ log: ['query'] });
/**
 * Creates an Express server leveraging 'apollo-server-express'
 * @param server {ApolloServer}
 * @returns {Promise<Express>}
 */
export async function createServer(server: ApolloServer): Promise<Express> {
  const app = express();
  await server.start();
  server.applyMiddleware({ app });
  return app;
}
