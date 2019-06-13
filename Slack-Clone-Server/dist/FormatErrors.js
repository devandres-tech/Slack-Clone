"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _lodash.default.pick(x, ['path', 'message']));
  }

  return [{
    path: 'name',
    message: 'something went wrong'
  }];
};

exports.default = _default;