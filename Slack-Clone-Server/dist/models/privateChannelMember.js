"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = sequelize => {
  const PrivateChannelMember = sequelize.define('private_channel_member', {});
  return PrivateChannelMember;
};

exports.default = _default;