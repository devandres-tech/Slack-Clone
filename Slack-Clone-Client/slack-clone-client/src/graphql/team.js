import gql from 'graphql-tag';

export const GET_ALL_TEAMS = gql`
{
  allTeams {
    id
    name
    channels {
      id
      name
    }
  }
}
`;
