import path from 'path';
import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';
import { transformSchemaFederation } from 'graphql-transform-federation';

import { prisma } from '@/context';
import * as Types from '@/resolvers';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from '@/permissions';

const schema = makeSchema({
  types: [Types],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), './generated/schema.graphql'),
    typegen: path.join(process.cwd(), '/generated/generated-types.d.ts'),
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});

export const federatedSchema = applyMiddleware(
  transformSchemaFederation(schema, {
    Query: {
      extend: true,
    },
    User: {
      keyFields: ['id'],
      async resolveReference(reference: any) {
        return prisma.user.findUnique({
          where: { id: reference.id },
        });
      },
    },
  }),
  permissions,
);
