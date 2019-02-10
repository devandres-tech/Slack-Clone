import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
query ($channelId: Int!) {
  messages(channelId:$channelId) {
    id
    text
    created_at
    user {
      username
    }
  }
}
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;
