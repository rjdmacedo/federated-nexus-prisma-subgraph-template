import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { nonNull, objectType, stringArg } from 'nexus';

import { APP_SECRET } from '@/utils';
import type { Context } from '@/context';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      description: 'Returns a token to authenticate a user',
      type: 'AuthPayload',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      // @ts-ignore
      resolve: async (_, args, context: Context) => {
        const user = await context.prisma.user.create({
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            password: await hash(args.password, 10),
          },
        });
        return {
          token: sign({ userId: user.id }, APP_SECRET, {
            algorithm: 'HS256',
            subject: `${user.id}`,
            expiresIn: '1d',
          }),
          user,
        };
      },
    });
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      // @ts-ignore
      resolve: async (_, args, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
        if (!user) {
          throw new Error(`No user found for email: ${args.email}`);
        }
        const passwordValid = await compare(args.password, user.password);
        if (!passwordValid) {
          throw new Error('Invalid password');
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET, {
            algorithm: 'HS256',
            subject: `${user.id}`,
            expiresIn: '1d',
          }),
          user,
        };
      },
    });
  },
});
