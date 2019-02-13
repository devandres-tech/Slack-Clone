import Sequelize from 'sequelize';

const sequelize = new Sequelize('slack', 'postgres', 'barcelona10', {
  dialect: 'postgres',
  define: {
    underscored: true,
  },
});

const models = {
  // models
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
  DirectMessage: sequelize.import('./directMessages'),
};


Object.keys(models).forEach((modelName) => {
  // Associate models if they have an associate method
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
