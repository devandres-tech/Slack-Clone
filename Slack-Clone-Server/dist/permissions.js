"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directMessageSubscription = exports.requiresTeamAccess = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var createResolver = function createResolver(resolver) {
  var baseResolver = resolver;

  baseResolver.createResolver = function (childResolver) {
    var newResolver =
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(parent, args, context, info) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return resolver(parent, args, context, info);

              case 2:
                return _context.abrupt("return", childResolver(parent, args, context, info));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function newResolver(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }();

    return createResolver(newResolver);
  };

  return baseResolver;
};
/** Requires Authentication */


var _default = createResolver(function (parent, args, _ref2) {
  var user = _ref2.user;

  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }
});
/** Fetch the channel we are trying to subscribe, and check
 * if you are a member of the team through our member table
 */


exports.default = _default;
var requiresTeamAccess = createResolver(
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(parent, _ref3, _ref4) {
    var channelId, user, models, channel, member;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            channelId = _ref3.channelId;
            user = _ref4.user, models = _ref4.models;

            if (!(!user || !user.user.id)) {
              _context2.next = 4;
              break;
            }

            throw new Error('Not authenticated, must require acesss');

          case 4:
            _context2.next = 6;
            return models.Channel.findOne({
              where: {
                id: channelId
              }
            });

          case 6:
            channel = _context2.sent;
            _context2.next = 9;
            return models.Member.findOne({
              where: {
                teamId: channel.teamId,
                userId: user.user.id
              }
            });

          case 9:
            member = _context2.sent;

            if (member) {
              _context2.next = 12;
              break;
            }

            throw new Error('You are not a member of this team, please request an invite');

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x5, _x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}());
exports.requiresTeamAccess = requiresTeamAccess;
var directMessageSubscription = createResolver(
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(parent, _ref6, _ref7) {
    var teamId, userId, user, models, members;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            teamId = _ref6.teamId, userId = _ref6.userId;
            user = _ref7.user, models = _ref7.models;

            if (!(!user || !user.user.id)) {
              _context3.next = 4;
              break;
            }

            throw new Error('Not authenticated, must require acesss');

          case 4:
            _context3.next = 6;
            return models.Member.findAll({
              where: (0, _defineProperty2.default)({
                teamId: teamId
              }, models.sequelize.Op.or, [{
                userId: userId
              }, {
                userId: user.user.id
              }])
            });

          case 6:
            members = _context3.sent;

            if (!(members.length !== 2)) {
              _context3.next = 9;
              break;
            }

            throw new Error('something went wrong!');

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x8, _x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}());
exports.directMessageSubscription = directMessageSubscription;