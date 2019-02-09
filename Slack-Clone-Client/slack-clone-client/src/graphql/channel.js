import gql from 'graphql-tag';

export const CREATE_CHANNEL_MUTATION = gql`
  mutation createChannel($teamId: Int!, $name: String!) {
  createChannel(teamId:$teamId, name:$name) {
    ok
    channel {
      id
      name
    }
  }
}
`;
