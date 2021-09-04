import { ApolloServer } from 'apollo-server-express';

import { federatedSchema } from '@/schema';

export const constructTestServer = ({ context = {} } = {}) => {
  const server = new ApolloServer({
    schema: federatedSchema,
    context,
  });

  return { server };
};
