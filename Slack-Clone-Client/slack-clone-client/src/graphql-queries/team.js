import gql from 'graphql-tag';

export const GET_ALL_TEAMS = gql`
{
  allTeams {
    id
    name
    owner
    channels {
      id
      name
    }
  }
  inviteTeams {
    id
    name
    owner
    channels {
      id
      name
    }
  }
}
`;
