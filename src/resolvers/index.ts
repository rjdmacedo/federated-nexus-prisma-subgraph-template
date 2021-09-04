import * as Types from './Types';
import { Query } from './Queries'
import { Mutation } from './Mutations'

export const resolvers = {
  ...Types,
  Query,
  Mutation
};
