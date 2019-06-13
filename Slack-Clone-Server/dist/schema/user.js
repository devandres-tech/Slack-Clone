"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n\n  type User {\n    id: Int!\n    username: String!\n    email: String!\n    teams: [Team!]!\n  }\n\n  type Query {\n    me: User!\n    getAllUsers: [User!]!\n    getUser(userId: Int!): User\n  }\n\n  type RegisterResponse {\n    ok: Boolean!\n    user: User\n    errors: [Error!]\n  }\n\n  type LoginResponse {\n    ok: Boolean!\n    token: String\n    refreshToken: String\n    errors: [Error!]\n  }\n\n  type Mutation {\n    register(username: String!, email: String!, password: String!): RegisterResponse!\n    login(email: String!, password: String!): LoginResponse!\n  }\n";
exports.default = _default;