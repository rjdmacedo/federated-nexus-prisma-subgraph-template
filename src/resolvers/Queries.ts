import { objectType } from 'nexus';

import { getUserId } from '@/utils';
import type { Context } from '@/context';

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.user();
    t.crud.users();
    t.field('me', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findUnique({ where: { id: getUserId(context) || undefined } });
      },
    });
  },
});
