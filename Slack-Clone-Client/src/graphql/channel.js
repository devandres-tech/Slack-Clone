import gql from 'graphql-tag';

export const CREATE_CHANNEL_MUTATION = gql`
  mutation createChannel($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
  createChannel(teamId:$teamId, name:$name, public: $public, members: $members) {
    ok
    channel {
      id
      name
    }
  }
}
`;

export const GET_OR_CREATE_CHANNEL_MUTATION = gql`
  mutation ($teamId: Int!, $members: [Int!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
    }
  }

`;
