import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({ log: ['query'] });

export interface Context {
  req: any; // HTTP request carrying the `Authorization` header
  userId: string;
  prisma: PrismaClient;
  permissions: Set<string>;
}

export const createContext = ({ req: request }: { req: any }): Context => {
  const userId = request?.headers['user-id'];
  const permissions = new Set<string>(request?.headers.permissions);

  return { ...request, prisma, userId, permissions };
};
