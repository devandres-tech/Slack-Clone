import bcrypt from 'bcrypt';

/** Create a 'User' table */
export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'Username must only contain letters and numbers',
        },
        len: {
          args: [3, 25],
          msg: 'The username needs to be between 3 and 25 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'The password must be between 5 and 100 characters long',
        },
      },
    },
  },
  {
    hooks: {
      afterValidate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        // eslint-disable-next-line no-param-reassign
        user.password = hashedPassword;
      },
    },
  });

  // Define associations
  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
    // N to M
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
