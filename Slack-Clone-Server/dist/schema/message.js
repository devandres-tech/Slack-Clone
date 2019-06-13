"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = `

  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
    created_at: String!
    url: String
    filetype: String
  }

  input File {
    type: String!
    path: String!
  }

  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }

  type Query {
    messages(offset: Int!, channelId: Int!): [Message!]!
  }

  type Mutation {
    createMessage(channelId: Int!, text: String, file: Upload): Boolean!
  }
`;
exports.default = _default;