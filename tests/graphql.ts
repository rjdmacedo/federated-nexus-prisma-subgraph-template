// noinspection GraphQLUnresolvedReference

import gql from 'graphql-tag';

export const createPlaylist = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      ... on User {
        id
        firstName
      }
    }
  }
`;

export const getUser = gql`
  query user($where: UserWhereUniqueInput!) {
    playlist(where: $where) {
      id
      email
    }
  }
`;
