import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import federatedSchema from '@/schema';
import { createServer } from '@/utils';
import { createContext, prisma } from '@/context';

export const apollo = new ApolloServer({
  schema: federatedSchema,
  context: createContext,
  plugins: [ApolloServerPluginInlineTrace()],
});

interface ServerConfig {
  port: String;
}

const config: ServerConfig = {
  port: process.env.SERVER_PORT || '4001',
};

export const run = async ({ port }: ServerConfig) => {
  const express = await createServer(apollo);
  express.listen({ port }, () => {
    console.log(`🚀 Server ${process.env.NODE_ENV} ready at http://localhost:${port}/graphql`);
  });
};

run(config).finally(async () => {
  await prisma.$disconnect();
});
