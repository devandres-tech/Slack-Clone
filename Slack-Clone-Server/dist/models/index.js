"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var sequelize = new _sequelize.default(process.env.TEST_DB || 'slack', 'postgres', 'barcelona10', {
  dialect: 'postgres',
  define: {
    underscored: true
  }
});
var models = {
  // models
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
  DirectMessage: sequelize.import('./directMessages'),
  PrivateChannelMember: sequelize.import('./privateChannelMember')
};
Object.keys(models).forEach(function (modelName) {
  // Associate models if they have an associate method
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = _sequelize.default;
var _default = models;
exports.default = _default;