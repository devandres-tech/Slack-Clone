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

export const GET_TEAM_MEMBERS_QUERY = gql`
  query($teamId: Int!) {
  getTeamMembers(teamId: $teamId) {
    id
    username
  }
}
`;

export const ADD_TEAM_MEMBER_MUTATION = gql`
mutation($email: String!, $teamId: Int!) {
  addTeamMember(email: $email, teamId: $teamId) {
    ok
    errors {
      path
      message
    }
  }
}
`;

export const CREATE_TEAM_MUTATION = gql`
 mutation createTeam($name: String!) {
  createTeam(name:$name) {
    ok
    team {
      id
    }
    errors {
      path
      message
    }
  }
}
`;
