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
      resolve: async (_, args, context: Context) => {
        const user = await context.prisma.user.create({
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            password: await hash(args.password, 10),
            type: 'RETAILER',
          },
        });

        await context.send({
          topic: 'user-created',
          messages: [
            {
              key: user.id,
              value: JSON.stringify(user),
            },
          ],
        });

        return {
          // TODO: add permissions and roles to the payload
          token: sign({}, APP_SECRET, {
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
          // TODO: add permissions and roles to the payload
          token: sign({}, APP_SECRET, {
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

/**
 * at retailer site, when a user signs-up
 *
 * 1. create a user (identity-service)
 *    - should produce a kafka message with topic "user_created" { userId }
 * 2. create a cart (with userId) (cart-service)
 *    - consume "user_created" and create a cart with the "userId"
 *    - should produce a kafka message with topic "cart_created" { cartId }
 * 3. attach cartId to user model (identity-service)
 *    - user-service should consume "cart_created" and update a user with the "cartId"
 *
 *                             gateway
 *        identity                               cart
 *        => produce user_crated                 => produce cart_created
 *        -> consume cart_created                -> consume user_created
 */
