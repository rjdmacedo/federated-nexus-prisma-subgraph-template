import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  description: '',
  definition(t) {
    t.id('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('password');
    t.boolean('confirmed');
    t.field('createdAt', { type: 'DateTime' });
    t.field('updatedAt', { type: 'DateTime' });
  },
});
