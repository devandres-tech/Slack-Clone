"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.channelBatcher = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var channelBatcher =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(ids, models, user) {
    var results, data;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return models.sequelize.query("\n      select distinct on(id) *\n      from channels as c \n      left outer join private_channel_members as pc \n      on c.id = pc.channel_id\n      where c.team_id in (:teamIds) and (c.public = true or pc.user_id = :userId);", {
              replacements: {
                teamIds: ids,
                userId: user.id
              },
              model: models.Channel,
              raw: true
            });

          case 2:
            results = _context.sent;
            data = {}; // group by team

            results.forEach(function (result) {
              if (data[result.team_id]) {
                data[result.team_id].push(result);
              } else {
                data[result.team_id] = [result];
              }
            });
            return _context.abrupt("return", ids.map(function (id) {
              return data[id];
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function channelBatcher(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.channelBatcher = channelBatcher;