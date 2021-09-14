import { objectType } from 'nexus';

import type { Context } from '@/context';

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.user();
    t.crud.users();
    t.field('me', {
      type: 'User',
      // @ts-ignore
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findUnique({
          where: { id: context.token?.sub },
        });
      },
    });
  },
});
