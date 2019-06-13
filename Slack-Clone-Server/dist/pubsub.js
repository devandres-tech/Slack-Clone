"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlRedisSubscriptions = require("graphql-redis-subscriptions");

var _default = new _graphqlRedisSubscriptions.RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: function retry_strategy(options) {
      return Math.max(options.attempt * 100, 3000);
    }
  }
});

exports.default = _default;