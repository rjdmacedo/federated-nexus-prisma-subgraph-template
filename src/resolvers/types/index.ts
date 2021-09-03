import { objectType, asNexusMethod } from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.field('user', { type: 'User' });
  },
});

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

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
