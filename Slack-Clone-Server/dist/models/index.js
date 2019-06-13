"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Sleep function to reconnect to database
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var _default = async () => {
  let maxReconnects = 20;
  let connected = false;
  const sequelize = new _sequelize.default(process.env.TEST_DB || 'slack', 'postgres', process.env.PG_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    define: {
      underscored: true
    }
  });

  while (!connected && maxReconnects) {
    try {
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log('reconnecting in 5 seconds...');
      await sleep(5000);
      maxReconnects -= 1;
    }
  }

  if (!connected) {
    return null;
  }

  const models = {
    // models
    User: sequelize.import('./user'),
    Channel: sequelize.import('./channel'),
    Message: sequelize.import('./message'),
    Team: sequelize.import('./team'),
    Member: sequelize.import('./member'),
    DirectMessage: sequelize.import('./directMessages'),
    PrivateChannelMember: sequelize.import('./privateChannelMember')
  };
  Object.keys(models).forEach(modelName => {
    // Associate models if they have an associate method
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });
  models.sequelize = sequelize;
  models.Sequelize = _sequelize.default;
  return models;
};

exports.default = _default;