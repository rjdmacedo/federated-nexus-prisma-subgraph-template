require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import { federatedSchema } from '@/schema';
import { createServer, pipe } from '@/utils';
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
  await pipe.producer.connect();
  await pipe.consumer.connect();
  await pipe.consumer.subscribe({ topic: 'cart-created', fromBeginning: true });
  await pipe.consumer.run();
  const express = await createServer(apollo);
  express.listen({ port }, () => {
    // tslint:disable-next-line:no-console
    console.log(`🚀 Server ${process.env.NODE_ENV} ready at http://localhost:${port}/graphql`);
  });
};

(async () => {
  try {
    await run(config);
  } catch (e) {
    await pipe.producer.disconnect();
    await pipe.consumer.disconnect();
  } finally {
    await prisma.$disconnect();
  }
})();
