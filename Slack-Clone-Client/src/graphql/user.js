import gql from 'graphql-tag';


export const GET_ME_QUERY = gql`
{
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
}
`;

export const GET_USER_QUERY = gql`
   query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
}
`;

export const GET_ALL_USERS = gql`
  {
    getAllUsers {
      id
      email
      username
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
