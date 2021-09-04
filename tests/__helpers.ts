import getPort from 'get-port';
import { ApolloServer } from 'apollo-server';
import { GraphQLClient } from 'graphql-request';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import { federatedSchema } from '@/schema';
import { Context, createContext } from '@/context';

interface TestContext extends Context {
  client: GraphQLClient;
}

export async function createTestServer() {
  return new ApolloServer({
    schema: federatedSchema,
    context: createContext,
    plugins: [ApolloServerPluginInlineTrace()],
  });
}

export const createTestContext = (): TestContext => {
  const context = Object.create({}) as TestContext;
  const graphqlContext = graphqlTestContext();

  beforeEach(async () => {
    const client = await graphqlContext.before();
    Object.assign(context, {
      client,
    });
  });

  afterEach(async () => {
    await graphqlContext.after();
  });

  return context;
};

const graphqlTestContext = () => {
  let server: ApolloServer | null = null;
  return {
    async before() {
      const port = await getPort();
      server = await createTestServer();
      await server.listen({ port });
      return new GraphQLClient(`http://localhost:${port}`);
    },
    async after() {
      await server?.stop();
    },
  };
};
