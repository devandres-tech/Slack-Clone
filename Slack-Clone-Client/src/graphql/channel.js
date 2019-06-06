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
