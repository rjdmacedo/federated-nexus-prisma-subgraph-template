require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import { createServer } from '@/utils';
import { federatedSchema } from '@/schema';
import { createContext, prisma } from '@/context';

export const apollo = new ApolloServer({
  schema: federatedSchema,
  context: createContext,
  plugins: [ApolloServerPluginInlineTrace()],
});

interface ServerConfig {
  port: string;
}

const config: ServerConfig = {
  port: process.env.SERVER_PORT || '4001',
};

const run = async ({ port }: ServerConfig) => {
  const express = await createServer(apollo);
  express.listen({ port }, () => {
    // tslint:disable-next-line:no-console
    console.log(`🚀 Server ${process.env.NODE_ENV} ready at http://localhost:${port}/graphql`);
  });
};

// tslint:disable-next-line:no-floating-promises
run(config).finally(async () => {
  await prisma.$disconnect();
});
