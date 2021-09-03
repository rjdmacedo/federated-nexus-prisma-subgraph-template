import { rule, shield } from 'graphql-shield';

import { getUserId } from '@/utils';
import type { Context } from '@/context';

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),

  isProfileOwner: rule()(async (_parent, args, context) => {
    const userId = getUserId(context);
    const profile = await context.prisma.profile
      .findUnique({
        where: {
          id: Number(args.id),
        },
      })
      .profile();
    return userId === profile.id;
  }),
};

export const permissions = shield({
  Query: {
    Me: rules.isAuthenticatedUser,
  },
  Mutation: {},
});
