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
export const GET_DIRECT_MESSAGES = gql`
  query($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
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
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
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
