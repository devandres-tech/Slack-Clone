"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(sequelize, DataTypes) {
  var Member = sequelize.define('member', {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return Member;
};

exports.default = _default;