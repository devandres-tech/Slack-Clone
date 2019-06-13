"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** Create a 'User' table */
var _default = (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define('direct_messages', {
    text: DataTypes.STRING
  }); // Define associations

  DirectMessage.associate = models => {
    // 1:M
    DirectMessage.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id'
      }
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id'
      }
    });
  };

  return DirectMessage;
};

exports.default = _default;