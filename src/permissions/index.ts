import { rule, shield } from 'graphql-shield';

import type { Context } from '@/context';

// @ts-ignore
const getPermissions = ({ user }) => {
  return ['read:own_account', 'read:any_account'];
};

const rules = {
  is: {
    authenticated: rule()((_parent, _args, { userId }: Context) => {
      return Boolean(userId);
    }),
    readingOwnAccount: rule()((parent, { id }, { userId }: Context) => {
      return userId === id;
      // return user.sub === id;
    }),
  },
  can: {
    readAnyAccount: rule()((parent, args, context: Context) => {
      const { userId } = context;
      const user = context.prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      const userPermissions = getPermissions({ user });
      return userPermissions.includes('read:any_account');
    }),
    readOwnAccount: rule()((parent, args, { user }) => {
      const userPermissions = getPermissions({ user });
      return userPermissions.includes('read:own_account');
    }),
  },
};

export const permissions = shield({
  Query: {
    me: rules.is.authenticated,
  },
  Mutation: {},
});
