import { extendType } from 'nexus';

export const Cart = extendType({
  type: 'Cart',
  definition(t) {
    t.id('id');
    t.field('owner', {
      type: 'User',
      // @ts-ignore
      resolve: (cart, _args, context) => {
        return context.prisma.user.findUnique({
          where: { cartId: cart.id || undefined },
        });
      },
    });
  },
});
