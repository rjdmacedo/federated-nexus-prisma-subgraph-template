import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { APP_SECRET } from '@/utils';

interface Token {
  userId: string;
}

export interface Context {
  req: any; // HTTP request carrying the `Authorization` header
  userId?: string;
  prisma: PrismaClient;
  permissions: Set<string>;
}

export const prisma = new PrismaClient({ log: ['query'] });

export const createContext = ({ req: request }: { req: any }): Context => {
  const token = getAuthToken(request);
  const userId = token?.userId;
  const permissions = new Set<string>(request?.headers.permissions);

  return { ...request, prisma, userId, permissions };
};

function getAuthToken(request: any): Token | null {
  const header = request.get('Authorization');
  if (header) {
    const token = header.replace('Bearer ', '');
    return verify(token, APP_SECRET) as Token;
  }
  return null;
}
