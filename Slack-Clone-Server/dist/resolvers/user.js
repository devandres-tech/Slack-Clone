"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _auth = require("../auth");

var _FormatErrors = _interopRequireDefault(require("../FormatErrors"));

var _permissions = _interopRequireDefault(require("../permissions"));

var _default = {
  User: {
    teams: function teams(parent, args, _ref) {
      var models = _ref.models,
          user = _ref.user;
      return models.sequelize.query('select * from teams as t join members as m on t.id = m.team_id where m.user_id = ?', {
        replacements: [user.id],
        model: models.Team,
        raw: true
      });
    }
  },
  Query: {
    me: _permissions.default.createResolver(function (parent, args, _ref2) {
      var models = _ref2.models,
          user = _ref2.user;
      return models.User.findOne({
        where: {
          id: user.id
        }
      });
    }),
    getAllUsers: function getAllUsers(parent, args, _ref3) {
      var models = _ref3.models;
      return models.User.findAll();
    },
    getUser: function getUser(parent, _ref4, _ref5) {
      var userId = _ref4.userId;
      var models = _ref5.models;
      return models.User.findOne({
        where: {
          id: userId
        }
      });
    }
  },
  Mutation: {
    login: function login(parent, _ref6, _ref7) {
      var email = _ref6.email,
          password = _ref6.password;
      var models = _ref7.models,
          SECRET = _ref7.SECRET,
          SECRET2 = _ref7.SECRET2;
      return (0, _auth.tryLogin)(email, password, models, SECRET, SECRET2);
    },
    register: function () {
      var _register = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(parent, args, _ref8) {
        var models, user;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                models = _ref8.models;
                _context.prev = 1;
                _context.next = 4;
                return models.User.create(args);

              case 4:
                user = _context.sent;
                return _context.abrupt("return", {
                  ok: true,
                  user: user
                });

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", {
                  ok: false,
                  errors: (0, _FormatErrors.default)(_context.t0, models)
                });

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 8]]);
      }));

      function register(_x, _x2, _x3) {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }
};
exports.default = _default;