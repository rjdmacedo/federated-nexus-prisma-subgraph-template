import { verify } from 'jsonwebtoken';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import type { ApolloServer } from 'apollo-server-express';
import type { Context } from '@/context';

interface Token {
  userId: string;
}

export const APP_SECRET = 'CHANGE-ME';
export const prisma = new PrismaClient({ log: ['query'] });

export function getUserId(context: Context) {
  const authHeader = context.req.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as Token;
    return verifiedToken && Number(verifiedToken.userId);
  }
}

export async function createServer(apollo: ApolloServer): Promise<Express> {
  const app = express();
  await apollo.start();
  apollo.applyMiddleware({ app });
  return app;
}
