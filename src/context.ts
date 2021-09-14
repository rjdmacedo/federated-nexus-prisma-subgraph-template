import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { ProducerRecord, RecordMetadata } from 'kafkajs';

import { APP_SECRET, pipe } from '@/utils';

/** @see https://auth0.com/docs/security/tokens/json-web-tokens/json-web-token-claims#reserved-claims */
interface Token {
  iat: number; // issued at
  exp: number; // expiration date
  sub: string; // subject identifier
}

export interface Context {
  req: any; // HTTP request carrying the `Authorization` header
  token: Token | null;
  prisma: PrismaClient;
  permissions: Set<string>;
  send(record: ProducerRecord): Promise<RecordMetadata[]>;
}

export const prisma = new PrismaClient({ log: ['query'] });

export const createContext = ({ req }: { req: any }): Context => {
  const token = getAuthToken(req);
  const permissions = new Set<string>(req?.headers.permissions);

  return {
    req,
    token,
    prisma,
    permissions,
    send: pipe.producer.send,
  };
};

function getAuthToken(request: any): Token | null {
  const header = request.get('Authorization');
  if (header) {
    const token = header.replace('Bearer ', '');
    return verify(token, APP_SECRET) as Token;
  }
  return null;
}
