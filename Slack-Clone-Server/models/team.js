/** Create a 'User' table */
export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  // Define associations
  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Team;
};