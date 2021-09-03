import getPort from 'get-port';
import { ApolloServer } from 'apollo-server';
import type { ServerInfo } from 'apollo-server';
import { GraphQLClient } from 'graphql-request';

import federatedSchema from '@/schema';
import { Context, createContext } from '@/context';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

interface TestContext extends Context {
  client: GraphQLClient;
}

export async function createTestServer({ port }: { port: Number }) {
  const server = new ApolloServer({
    schema: federatedSchema,
    context: createContext,
    plugins: [ApolloServerPluginInlineTrace()],
  });

  const { url } = await server.listen({ port });
  console.log(`🚀 Server ready at ${url}`);
}

export function createTestContext(): TestContext {
  let context = {} as TestContext;
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
}

function graphqlTestContext() {
  let serverInstance: ServerInfo | null = null;
  return {
    async before() {
      const port = await getPort();
      await createTestServer({ port });
      return new GraphQLClient(`http://localhost:${port}`);
    },
    async after() {
      serverInstance?.server.close();
    },
  };
}
