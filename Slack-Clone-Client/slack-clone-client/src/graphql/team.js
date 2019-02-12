import gql from 'graphql-tag';

export const GET_ME_QUERY = gql`
{
  me {
    id
    username
    teams {
      id
      name
      channels {
        id
        name
      }
    }
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
