"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _FormatErrors = _interopRequireDefault(require("../FormatErrors"));

var _permissions = _interopRequireDefault(require("../permissions"));

var _default = {
  Query: {
    getTeamMembers: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(parent, _ref, _ref2) {
        var teamId, models;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                teamId = _ref.teamId;
                models = _ref2.models;
                return _context.abrupt("return", models.sequelize.query('select * from users as u join members as m on m.user_id = u.id where m.team_id = ?', {
                  replacements: [teamId],
                  model: models.User,
                  raw: true
                }));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    createTeam: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref5 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(parent, args, _ref4) {
        var models, user, response;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                models = _ref4.models, user = _ref4.user;
                _context3.prev = 1;
                _context3.next = 4;
                return models.sequelize.transaction(
                /*#__PURE__*/
                function () {
                  var _ref6 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee2(transaction) {
                    var team;
                    return _regenerator.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return models.Team.create((0, _objectSpread2.default)({}, args, {
                              owner: user.id
                            }), {
                              transaction: transaction
                            });

                          case 2:
                            team = _context2.sent;
                            _context2.next = 5;
                            return models.Channel.create({
                              name: 'general',
                              public: true,
                              teamId: team.id
                            }, {
                              transaction: transaction
                            });

                          case 5:
                            _context2.next = 7;
                            return models.Member.create({
                              teamId: team.id,
                              userId: user.id,
                              admin: true
                            }, {
                              transaction: transaction
                            });

                          case 7:
                            return _context2.abrupt("return", team);

                          case 8:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x7) {
                    return _ref6.apply(this, arguments);
                  };
                }());

              case 4:
                response = _context3.sent;
                return _context3.abrupt("return", {
                  ok: true,
                  team: response
                });

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                console.log(_context3.t0);
                return _context3.abrupt("return", {
                  ok: false,
                  errors: (0, _FormatErrors.default)(_context3.t0, models)
                });

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 8]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref5.apply(this, arguments);
      };
    }()),
    addTeamMember: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref9 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(parent, _ref7, _ref8) {
        var email, teamId, models, user, memberPromise, userToAddPromise, _ref10, _ref11, member, userToAdd;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                email = _ref7.email, teamId = _ref7.teamId;
                models = _ref8.models, user = _ref8.user;
                _context4.prev = 2;
                memberPromise = models.Member.findOne({
                  where: {
                    teamId: teamId,
                    userId: user.id
                  }
                }, {
                  raw: true
                });
                userToAddPromise = models.User.findOne({
                  where: {
                    email: email
                  }
                }, {
                  raw: true
                }); // wait for both promises to finish

                _context4.next = 7;
                return Promise.all([memberPromise, userToAddPromise]);

              case 7:
                _ref10 = _context4.sent;
                _ref11 = (0, _slicedToArray2.default)(_ref10, 2);
                member = _ref11[0];
                userToAdd = _ref11[1];

                if (member.admin) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{
                    path: 'email',
                    message: 'You cannot add members to the team'
                  }]
                });

              case 13:
                if (userToAdd) {
                  _context4.next = 15;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{
                    path: 'email',
                    message: 'Could not find user with this email'
                  }]
                });

              case 15:
                _context4.next = 17;
                return models.Member.create({
                  userId: userToAdd.id,
                  teamId: teamId
                });

              case 17:
                return _context4.abrupt("return", {
                  ok: true
                });

              case 20:
                _context4.prev = 20;
                _context4.t0 = _context4["catch"](2);
                console.log(_context4.t0);
                return _context4.abrupt("return", {
                  ok: false,
                  errors: (0, _FormatErrors.default)(_context4.t0, models)
                });

              case 24:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[2, 20]]);
      }));

      return function (_x8, _x9, _x10) {
        return _ref9.apply(this, arguments);
      };
    }())
  },
  Team: {
    channels: function channels(_ref12, args, _ref13) {
      var id = _ref12.id;
      var channelLoader = _ref13.channelLoader;
      return channelLoader.load(id);
    },
    directMessageMembers: function directMessageMembers(_ref14, args, _ref15) {
      var id = _ref14.id;
      var models = _ref15.models,
          user = _ref15.user;
      return models.sequelize.query('select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId', {
        replacements: {
          currentUserId: user.id,
          teamId: id
        },
        model: models.User,
        raw: true
      });
    }
  }
};
exports.default = _default;