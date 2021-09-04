import gql from 'graphql-tag';

export const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        password
        confirmed
        createdAt
        updatedAt
      }
    }
  }
`;

export const getUser = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      firstName
      lastName
      email
      password
      confirmed
      createdAt
      updatedAt
    }
  }
`;
