import Sequelize from 'sequelize';

const sequelize = new Sequelize('slack', 'postgres', 'postgres');

const models = {
  // models
  user: sequelize.import('./users'),
  channel: sequelize.import('./channel'),
  messages: sequelize.import('./messages'),
  team: sequelize.import('./team'),
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
