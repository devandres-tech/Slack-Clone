"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize.default(process.env.TEST_DB || 'slack', 'postgres', 'barcelona10', {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  define: {
    underscored: true
  }
});
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
var _default = models;
exports.default = _default;