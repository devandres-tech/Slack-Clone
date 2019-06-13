"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n\n  type Message {\n    id: Int!\n    text: String!\n    user: User!\n    channel: Channel!\n    created_at: String!\n    url: String\n    filetype: String\n  }\n\n  input File {\n    type: String!\n    path: String!\n  }\n\n  type Subscription {\n    newChannelMessage(channelId: Int!): Message!\n  }\n\n  type Query {\n    messages(offset: Int!, channelId: Int!): [Message!]!\n  }\n\n  type Mutation {\n    createMessage(channelId: Int!, text: String, file: Upload): Boolean!\n  }\n";
exports.default = _default;