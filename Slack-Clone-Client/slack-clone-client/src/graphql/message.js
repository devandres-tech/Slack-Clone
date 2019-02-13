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
query($teamId: Int!, $otherUserId: Int!) {
  directMessages(teamId: $teamId, otherUserId: $otherUserId) {
    id
    text
    created_at
    sender {
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
