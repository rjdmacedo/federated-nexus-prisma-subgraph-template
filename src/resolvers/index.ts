import * as Types from '@/resolvers/types';
import { Query } from '@/resolvers/Queries';
import { Mutation } from '@/resolvers/Mutations';

export const resolvers = {
  ...Types,
  Query,
  Mutation,
};
