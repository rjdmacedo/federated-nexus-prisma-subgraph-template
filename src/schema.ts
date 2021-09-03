import path from 'path';
import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';
import { transformSchemaFederation } from 'graphql-transform-federation';

import { prisma } from '@/context';
import * as allTypes from '@/resolvers';

const schema = makeSchema({
  types: [allTypes],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), './generated/schema.graphql'),
    typegen: path.join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  prettierConfig: __dirname + '/../.prettierrc.json',
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});

const federatedSchema = transformSchemaFederation(schema, {
  Query: {
    extend: true,
  },
  User: {
    keyFields: ['id'],
    async resolveReference(reference: any) {
      return await prisma.user.findUnique({
        where: { id: reference.id },
      });
    },
  },
});

export default federatedSchema;
