"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** Create a 'User' table */
var _default = (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  }); // Define associations

  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    });
  };

  return Team;
};

exports.default = _default;