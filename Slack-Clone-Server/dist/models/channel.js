"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** Create a 'User' table */
var _default = function _default(sequelize, DataTypes) {
  var Channel = sequelize.define('channel', {
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    dm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }); // Define associations

  Channel.associate = function (models) {
    // 1:M
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    }); // N to M

    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    }); // N to M

    Channel.belongsToMany(models.User, {
      through: models.PrivateChannelMember,
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
  };

  return Channel;
};

exports.default = _default;