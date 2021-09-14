import type { Context } from '@/context';
import { rule, shield } from 'graphql-shield';

// @ts-ignore
const getPermissions = ({ user }) => {
  return ['read:own:account', 'read:any:account'];
};

const rules = {
  is: {
    authenticated: rule()((_parent: any, _args: any, context: Context) => {
      return Boolean(context.token?.sub);
    }),
    readingOwnAccount: rule()((parent, { id }, context: Context) => {
      return context.token?.sub === id;
    }),
  },
  can: {
    readAnyAccount: rule()((parent, args, context: Context) => {
      const user = context.prisma.user.findUnique({
        where: {
          id: context.token?.sub,
        },
      });
      const userPermissions = getPermissions({ user });
      return userPermissions.includes('read:any:account');
    }),
    readOwnAccount: rule()((parent, args, { user }) => {
      const userPermissions = getPermissions({ user });
      return userPermissions.includes('read:own:account');
    }),
  },
};

export const permissions = shield({
  Query: {
    me: rules.is.authenticated,
  },
  Mutation: {},
});
