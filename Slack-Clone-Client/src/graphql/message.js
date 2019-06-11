import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
query ($offset: Int!, $channelId: Int!) {
  messages(offset: $offset, channelId:$channelId) {
    id
    text
    created_at
    user {
      username
    }
    url
    filetype
  }
}
`;
export const DIRECT_MESSAGES_QUERY = gql`
  query DIRECT_MESSAGES_QUERY($teamId: Int!, $otherUserId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $otherUserId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation($channelId: Int!, $text: String!, $file: Upload) {
    createMessage(channelId: $channelId, text: $text, file: $file)
  }
`;

export const CREATE_DIRECT_MESSAGE_MUTATION = gql`
mutation($receiverId:Int!, $text: String!, $teamId: Int!) {
  createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
}
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      created_at
    }
  }
`;

export const DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;
